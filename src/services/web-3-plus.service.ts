import {inject, Provider} from '@loopback/core';
import {getService, juggler} from '@loopback/service-proxy';
import {Web3PlusDataSource} from '../datasources';

export interface Web3PlusService {
  web3: any;
  providerName: string;
  contracts: any;
  reconnectWeb3: any;
  from: any;
}

export class Web3PlusServiceProvider implements Provider<Web3PlusService> {
  constructor(
    @inject('datasources.web3plus')
    protected dataSource: juggler.DataSource = new Web3PlusDataSource(),
  ) {}

  value(): Promise<Web3PlusService> {
    return getService(this.dataSource);
  }
}
