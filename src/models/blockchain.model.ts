import {Entity, model, property} from '@loopback/repository';
import moment from "moment";

@model()
export class Blockchain extends Entity {
  @property({
    type: 'number',
    id: true,
    required: false,
    generated: true,
    useDefaultIdType: false,
    defaultFn: 'now',
    postgresql: {
      defaultFn: 'now',
    },
  })
  id: string;

  @property({
    type: 'number',
    required: true,
  })
  nonce: number;

  @property({
    type: 'string',
    required: true,
  })
  txHash: string;

  @property({
    type: 'number',
    required: true,
    default: moment.utc().unix(),
  })
  timestamp: number;

  @property({
    type: 'string',
    required: true,
    default: 'unregistered',
    jsonSchema: {
      type: 'string',
      enum: ['unregistered', 'pending', 'mined', 'confirmed'],
    },
  })
  registrationState: string;

  constructor(data?: Partial<Blockchain>) {
    super(data);
  }
}

export interface BlockchainRelations {
  // describe navigational properties here
}

export type BlockchainWithRelations = Blockchain & BlockchainRelations;
