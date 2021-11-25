import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDbDataSource} from '../datasources';
import {Registry, RegistryRelations} from '../models';

export class RegistryRepository extends DefaultCrudRepository<
  Registry,
  typeof Registry.prototype.id,
  RegistryRelations
> {
  constructor(
    @inject('datasources.postgresDB') dataSource: PostgresDbDataSource,
  ) {
    super(Registry, dataSource);
  }
}
