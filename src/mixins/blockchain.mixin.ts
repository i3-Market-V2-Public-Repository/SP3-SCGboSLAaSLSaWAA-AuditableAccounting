import {MixinTarget} from '@loopback/core';
import {IsolationLevel} from '@loopback/repository';
import moment from 'moment';
import {
  CONNECTION_ERROR,
  CONNECTION_ERROR_PENDING,
  NOT_NEW_REGISTRIES,
  OK_RESPONSE,
  TRANSACTION_STATUS
} from '../controllers/oas-specifications';
import {Blockchain} from '../models';
import {BlockchainRepository} from '../repositories';
import {MerkleTreeService} from '../services';
import {
  InfoForRegistries,
  InfoForTransactions,
  MerkleProofType
} from '../types';

export interface Repository {
  find: (param: any) => any;
  updateById: (id: any, data: any, options?: any | undefined) => any;
  dataSource: any;
}

export function BlockchainMixin<T extends MixinTarget<object>>(
  baseClass: T,
  smartContract: string,
) {
  return class extends baseClass {
    web3: any;
    smartContract: string;
    providerName: string;
    contracts: any;
    reconnectWeb3: any;
    from: any;
    contractAddress: any;
    merkleTreeService: MerkleTreeService;
    blockchainRepo: BlockchainRepository;
    constructor(...args: any[]) {
      super(args);
      this.smartContract = smartContract;
      this.web3 = args[0].web3;
      this.providerName = args[0].providerName;
      this.contracts = args[0].contracts;
      this.reconnectWeb3 = args[0].reconnectWeb3;
      this.from = args[0].from;
      this.contractAddress = this.contracts[smartContract].options.address;
      this.merkleTreeService = args[1];
      this.blockchainRepo = args[2];
    }

    // This function returns the current root of the Merkle tree stored in the SC
    async mixinGetCurrentRoot(): Promise<any> {
      try {
        const root = this.web3.utils.numberToHex(
          await this.contracts[this.smartContract].methods.currentRoot().call(),
        );
        return OK_RESPONSE(this.providerName, this.contractAddress, root, '-1');
      } catch (error: any) {
        console.log(error);
        if (error.message.includes('connection not open')) {
          const reconnected = await this.reconnectWeb3(); // try to reconnect to blockchain
          if (!reconnected) {
            return CONNECTION_ERROR(this.providerName, this.contractAddress);
          }
          try {
            const root = this.web3.utils.numberToHex(
              await this.contracts[this.smartContract].methods
                .currentRoot()
                .call(),
            );
            return OK_RESPONSE(
              this.providerName,
              this.contractAddress,
              root,
              '-1',
            );
          } catch (newError: any) {
            if (newError.message.includes('connection not open')) {
              return CONNECTION_ERROR(this.providerName, this.contractAddress);
            }
          }
        }
        return CONNECTION_ERROR(this.providerName, this.contractAddress);
      }
    }

    // This function updates the current root of the Merkle tree stored in the SC
    async mixinCalculateMerkleTree(repositories: Repository[]): Promise<any> {
      //For each repo, get all registries that are pending (does not have merkleRoot and are readyForRegistration)
      const registries: InfoForRegistries[] = [];

      for (const [index, repo] of repositories.entries()) {
        const registriesPending = await repo.find({
          order: ['dateOfReception DESC'],
          where: {
            // merkleRoot: {eq: ''}, // no va si aixo es treu
            readyForRegistration: {eq: true},
          },
        });

        //For each registry, we are only interesting in its id and hash
        for (const registry of registriesPending) {
          const registration: InfoForRegistries = {
            id: registry.id!,
            hash: registry.dataHash!,
            indexRepo: index, //Important to store the index of the repo they belong to be able to update it later.
          };
          registries.push(registration);
        }
      }

      if (registries.length === 0) {
        return NOT_NEW_REGISTRIES(this.providerName, this.contractAddress);
      }

      //We get an array of string containing all the hashes that will be used to construct our MerkleTree
      const hashOfRegistries: string[] = registries.map(hashValue => {
        return hashValue['hash'];
      });

      const treeStruct = this.merkleTreeService.tree(hashOfRegistries);
      const newRoot = treeStruct[0]; //The merkle root is the element on the 1st position of the array since it is constructed as a binary tree

      const latestTxCreated = await this.blockchainRepo.findOne({
        order: ['nonce DESC'],
      }); //Last nonce stored in our DB

      //console.log('LATEST CREATED TX', latestTxCreated);

      let nextNonce = await this.web3.eth.getTransactionCount(
        this.from.address,
      ); //Last nonce of a transaction that we have sent to Blockchain

      console.log('NEXT NONCE', nextNonce);

      //It is important to check if latestTxCreated because the first time a transaction is sent, latestTxCreated will be null;
      //This IF is done because we may accumulate several Tx in our database before sending it to Blockchain, and each TX should have a different nonce.
      if (latestTxCreated && nextNonce <= latestTxCreated.nonce) {
        nextNonce = latestTxCreated!.nonce + 1;
      }

      console.log('NEXT NONCE AFTER MODIF', nextNonce);

      //Precalculate the transaction hash value using Hardapps connector
      const txInfo = await this.contracts[this.smartContract].methods
        .setNewRegistry(newRoot)
        .signedTx({nonce: nextNonce});

      //console.log('TX INFO', txInfo);

      const txHash = txInfo.signedTx.transactionHash;

      //We will update all the registries of the Merkle Tree in our database transactionally, meaning that if any of
      //the updates fails, all of them will be reverted

      //If IsolationLevel.READ_COMMITED, queries sees only data committed before the query began and never sees either
      // uncommitted data or changes committed during query execution by concurrent transactions
      const tx = await repositories[0].dataSource.beginTransaction({
        isolationLevel: IsolationLevel.READ_COMMITTED,
        timeout: 60000,
      });

      try {
        //We update every registry by adding the merkleRoot and its proof
        for (let i = 0; i < registries.length; ++i) {
          const proof: MerkleProofType[] = this.merkleTreeService.proof(
            treeStruct,
            registries[i].hash,
          );

          const updatedRegistry = {
            merkleRoot: newRoot,
            merkleProof: proof,
          };

          await repositories[registries[i].indexRepo].updateById(
            registries[i].id,
            updatedRegistry,
            {transaction: tx},
          );
        }

        const blockchainInfo: Partial<Blockchain> = {};
        blockchainInfo.id = newRoot;
        blockchainInfo.nonce = txInfo.nonce;
        blockchainInfo.txHash = txHash;
        blockchainInfo.registrationState = 'unregistered'; //Not stored neither send to Blockchain yet
        await this.blockchainRepo.create(blockchainInfo, {transaction: tx});

        await tx.commit();
      } catch (error) {
        await tx.rollback();
      }

      return OK_RESPONSE(
        this.providerName,
        this.contractAddress,
        newRoot,
        txHash,
      );
    }

    // This function register the tx to the Blockchain
    async mixinUpdateTxStatus(
      timeBeforeUpdatingGasPrice: number,
    ): Promise<any> {
      try {
        await this.web3.eth.net.isListening();
      } catch (err: any) {
        if (err.message.includes('connection not open')) {
          return CONNECTION_ERROR_PENDING(
            this.providerName,
            this.contractAddress,
          );
        }
      }

      let newTxSentToBlockchain: InfoForTransactions[] = [];
      const txNotSendedToBlockchain = await this.blockchainRepo.find({
        order: ['nonce ASC'], //Does not matter the order
        where: {registrationState: {eq: 'unregistered'}}, //Get all txHash that are not sent to the Blockchain
      });

      console.log(
        'Transactions not sended to Blockchain',
        txNotSendedToBlockchain,
      );

      for (let tx of txNotSendedToBlockchain) {
        //Calculate the signed Tx
        const txInfo = await this.contracts[smartContract].methods
          .setNewRegistry(tx!.id)
          .signedTx({
            nonce: tx!.nonce,
          });

        console.log('txInfo:', txInfo);

        //Send the signed Tx to the Blockchain
        await this.contracts[smartContract].methods.setNewRegistry(tx.id).send({
          signedTx: txInfo.signedTx,
        });

        //Once sent, we update the state of that tx hash from unregistered -> pending
        await this.blockchainRepo.updateById(tx.id, {
          registrationState: 'pending',
        });

        newTxSentToBlockchain.push({
          txHash: tx.txHash,
          nonce: tx.nonce,
        });
      }

      const txPendingToBeMined = await this.blockchainRepo.find({
        where: {registrationState: {eq: 'pending'}},
      });

      //For each transaction that is pending in our database, we check the transaction on the Blockchain to
      //chek it has already been mined
      const txPendingInfo = await Promise.all(
        txPendingToBeMined.map(blockchainInfo =>
          this.web3.eth.getTransaction(blockchainInfo.txHash),
        ),
      );

      console.log('TX', txPendingInfo);

      const currentBlockNumber = await this.web3.eth.getBlockNumber();

      const txMined = txPendingInfo.filter(tx => {
        return (
          tx !== null &&
          tx.blockNumber !== null &&
          currentBlockNumber - tx.blockNumber <= 12
        );
      });

      const txConfirmed = txPendingInfo.filter(tx => {
        //In order a transaction to be confirmed, it has to have a blockNumber and 12 blocks mined above
        return (
          tx !== null &&
          tx.blockNumber !== null &&
          currentBlockNumber - tx.blockNumber >= 12
        );
      });

      const txMinedHashes: string[] = txMined.map(tx => tx.hash);
      const txConfirmedHashes: string[] = txConfirmed.map(tx => tx.hash);

      await this.blockchainRepo.updateAll(
        {registrationState: 'mined'},
        {txHash: {inq: txMinedHashes}},
      );

      await this.blockchainRepo.updateAll(
        {registrationState: 'confirmed'},
        {txHash: {inq: txConfirmedHashes}},
      );

      const txNotMined = txPendingInfo.filter(tx => {
        return tx !== null && tx.blockNumber === null; //If a transaction is not mined, it will not be in any block
      });

      const txNotMinedHashes: string[] = txNotMined.map(tx => tx.hash);

      //Get Blockchain information stored in our database for all those tx that has not been mined
      const blockchainInfoTxNotMined = await this.blockchainRepo.find({
        where: {txHash: {inq: txNotMinedHashes}},
      });

      // let txUpdatedGasPrice: Array<InfoForTransactions> = [];

      for (let tx of blockchainInfoTxNotMined) {
        //If it has happened more than an established time since the tx was sent to be mined, update its gas price
        if (moment.utc().unix() - tx!.timestamp > timeBeforeUpdatingGasPrice) {
          //Calculate the signed Tx
          const txInfo = await this.contracts[smartContract].methods
            .setNewRegistry(tx!.id)
            .signedTx({
              nonce: tx!.nonce,
            });

          const transaction = await this.blockchainRepo.dataSource.beginTransaction(
            {
              isolationLevel: IsolationLevel.READ_COMMITTED,
              timeout: 60000,
            },
          );

          //If we can not update the transaction gasPrice on the Blockchain, we do not store the gasPrice change on our
          //database by doing a transaction.rollback();
          try {
            await this.blockchainRepo.updateById(
              tx!.id,
              {
                txHash: txInfo.signedTx.transactionHash,
              },
              {transaction: transaction},
            );

            //Send the signed Tx to the Blockchain
            await this.contracts[this.smartContract].methods
              .setNewRegistry(tx!.id)
              .send({
                signedTx: txInfo.signedTx,
              });
            transaction.commit();
          } catch (error: any) {
            transaction.rollback();
            if (error.message.includes('connection not open')) {
              return CONNECTION_ERROR(this.providerName, this.contractAddress);
            }
          }
        }
      }

      return TRANSACTION_STATUS(
        this.providerName,
        this.contractAddress,
        newTxSentToBlockchain,
      );
    }
  };
}
