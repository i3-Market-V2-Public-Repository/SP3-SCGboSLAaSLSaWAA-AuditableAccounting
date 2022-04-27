import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDbDataSource} from '../datasources';
import {MerkleTree, MerkleTreeWithRelations} from "../models/merkletree.model";

export class MerkleTreeRepository extends DefaultCrudRepository<
    MerkleTree,
    typeof MerkleTree.prototype.id,
    MerkleTreeWithRelations
> {
  constructor(
    @inject('datasources.postgresDB') dataSource: PostgresDbDataSource,
  ) {
    super(MerkleTree, dataSource);
  }
}
