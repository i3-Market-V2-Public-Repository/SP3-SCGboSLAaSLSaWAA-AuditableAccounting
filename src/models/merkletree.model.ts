import {Entity, model, property} from '@loopback/repository';
import moment from "moment";
import {Blockchain} from "./blockchain.model";

@model()
export class MerkleTree extends Entity {
  @property({
    id: true,
    type: 'string',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  merkletree: string;

  @property({
    type: 'number',
    required: true,
    default: moment.utc().unix(),
  })
  timestamp: number;

  constructor(data?: Partial<MerkleTree>) {
    super(data);
  }
}

export interface MerkleTreeRelations {
  // describe navigational properties here
}

export type MerkleTreeWithRelations = MerkleTree & MerkleTreeRelations;

