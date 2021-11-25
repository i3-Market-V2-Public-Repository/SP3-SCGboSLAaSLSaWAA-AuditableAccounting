import {ResponseObject} from '@loopback/rest';

export enum TipusFull {
  FS = 'FS',
}

export const RESP_GET_ROOT: ResponseObject = {
  description: 'GET response of object for getting the current Merkle Root',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          blockchainNetwork: {type: 'string'},
          smartContractAddress: {type: 'string'},
          response: {
            type: 'object',
            properties: {
              status: {type: 'number', minimum: 0, maximum: 1},
              message: {
                type: 'string',
                enum: ['ok', 'blockchain connection error'],
              },
              MerkleRoot: {type: 'string'},
            },
          },
        },
      },
    },
  },
};

export const RESP_UPDATE_BLOCKCHAIN_TX: ResponseObject = {
  description: 'GET response of object for getting the pending actions',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          blockchainNetwork: {type: 'string'},
          smartContractAddress: {type: 'string'},
          response: {
            type: 'object',
            properties: {
              status: {type: 'number', minimum: 0, maximum: 1},
              message: {
                type: 'string',
                enum: ['ok', 'blockchain connection error'],
              },
              newTxSentToBlockchain: {
                type: 'array',
                items: {type: 'object'},
              },
              txUpdatedGasPrice: {type: 'array', items: {type: 'object'}},
              newConfirmedTx: {type: 'array', items: {type: 'object'}},
            },
          },
        },
      },
    },
  },
};

export const RESP_CALCULATE_ROOT: ResponseObject = {
  description: 'UPDATE response object for updating the Merkle Root',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          blockchainNetwork: {type: 'string'},
          smartContractAddress: {type: 'string'},
          response: {
            type: 'object',
            properties: {
              status: {type: 'number', minimum: 0, maximum: 2},
              message: {
                type: 'string',
                enum: [
                  'ok',
                  'blockchain connection error',
                  'there are not new registries',
                ],
              },
              MerkleRoot: {type: 'string'},
              txHash: {type: 'string'},
            },
          },
        },
      },
    },
  },
};

export const CONNECTION_ERROR = (provider: any, contract: any) => ({
  blockchainNetwork: provider,
  smartContractAddress: contract,
  response: {
    status: 1,
    message: 'blockchain connection error',
    MerkleRoot: '-1',
  },
});

export const CONNECTION_ERROR_PENDING = (provider: any, contract: any) => ({
  blockchainNetwork: provider,
  smartContractAddress: contract,
  response: {
    status: 1,
    message: 'blockchain connection error',
    newTxSentToBlockchain: [],
    txUpdatedGasPrice: [],
    newConfirmedTx: [],
  },
});

export const TRANSACTION_STATUS = (
  provider: any,
  contract: any,
  newTxSentToBlockchain: Array<any>,
) => ({
  blockchainNetwork: provider,
  smartContractAddress: contract,
  response: {
    status: 0,
    message: 'OK',
    newTxSentToBlockchain: newTxSentToBlockchain,
  },
});

export const NOT_NEW_REGISTRIES = (provider: any, contract: any) => ({
  blockchainNetwork: provider,
  smartContractAddress: contract,
  response: {
    status: 2,
    message: 'Not new registries',
    txHash: '-1',
  },
});

export const OK_RESPONSE = (
  provider: any,
  contract: any,
  root: string,
  txHash: string,
) => ({
  blockchainNetwork: provider,
  smartContractAddress: contract,
  response: {
    status: 0,
    message: 'ok',
    MerkleRoot: root,
    txHash: txHash,
  },
});
