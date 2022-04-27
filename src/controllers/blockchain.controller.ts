import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, post} from '@loopback/rest';
import {BlockchainMixin} from '../mixins/blockchain.mixin';
import {BlockchainRepository, RegistryRepository} from '../repositories';
import {MerkleTreeService} from '../services';
import {MERKLE_TREE_SERVICE} from '../services/keys';
import {
  RESP_CALCULATE_ROOT,
  RESP_GET_ROOT,
  RESP_UPDATE_BLOCKCHAIN_TX
} from './oas-specifications';

class BaseController {
  constructor(
    dataAccessObject: any,
    merkleTreeService: MerkleTreeService,
    blockchainRepo: BlockchainRepository,
  ) { }
}

export class RegistryBlockchainController extends BlockchainMixin(
  BaseController,
  'Registry',
) {
  constructor(
    @inject('services.Web3PlusService') dataAccessObject: any,
    @inject(MERKLE_TREE_SERVICE) public merkleTreeService: MerkleTreeService,
    @repository(BlockchainRepository)
    public blockchainRepo: BlockchainRepository,
    @repository(RegistryRepository)
    protected registryRepository: RegistryRepository,
  ) {
    super(dataAccessObject, merkleTreeService, blockchainRepo);
  }

  @post('/calculateMerkleRoot', {
    security: [{openidConnect: []}],
    responses: {'200': RESP_CALCULATE_ROOT},
  })
  async calculateMerkleTree(): Promise<any> {
    return this.mixinCalculateMerkleTree([this.registryRepository]);
  }

  @get('/getCurrentRoot', {
    security: [{openidConnect: []}],
    responses: {'200': RESP_GET_ROOT},
  })
  async getCurrentRoot(): Promise<any> {
    return this.mixinGetCurrentRoot();
  }

  @post('/updateRegistries', {
    security: [{openidConnect: []}],
    responses: {'200': RESP_UPDATE_BLOCKCHAIN_TX},
  })
  async updateTxStatus(): Promise<any> {
    const response = await this.mixinUpdateTxStatus(43200000);
    return response;
  }
}
