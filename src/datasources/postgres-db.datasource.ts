import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {config} from './postgres-db.datasource config';

@lifeCycleObserver('datasource')
export class PostgresDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'postgresDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.postgresDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
