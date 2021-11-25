import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {config} from './web-3-plus.datasource config';

export class Web3PlusDataSource extends juggler.DataSource {
  static dataSourceName = 'web3plus';

  constructor(
    @inject('datasources.config.web3plus', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
