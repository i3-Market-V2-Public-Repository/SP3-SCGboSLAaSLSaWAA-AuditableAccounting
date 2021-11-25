import {BindingKey} from '@loopback/context';
import {MerkleTreeService} from './merkle-tree.service';

export const MERKLE_TREE_SERVICE = BindingKey.create<MerkleTreeService>(
  'services.MerkleTreeService',
);
