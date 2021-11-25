import {Entity, model, property} from '@loopback/repository';

@model()
export class Registry extends Entity {
  @property({
    id: true,
    type: 'number',
  })
  id?: number;

  @property({
    type: 'number',
  })
  dateOfReception?: number;

  @property({
    type: 'string',
  })
  dataHash?: string;

  @property({
    type: 'string',
  })
  merkleRoot?: string;

  @property({
    type: 'array',
    itemType: 'any',
  })
  merkleProof?: any[];

  @property({
    type: 'boolean',
    default: true,
  })
  readyForRegistration?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Registry>) {
    super(data);
  }
}

export interface RegistryRelations {
  // describe navigational properties here
}

export type RegistryWithRelations = Registry & RegistryRelations;
