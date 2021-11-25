import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDbDataSource} from '../datasources';
import {Blockchain, BlockchainRelations} from '../models';

export class BlockchainRepository extends DefaultCrudRepository<
  Blockchain,
  typeof Blockchain.prototype.id,
  BlockchainRelations
> {
  constructor(
    @inject('datasources.postgresDB') dataSource: PostgresDbDataSource,
  ) {
    super(Blockchain, dataSource);
  }
}
