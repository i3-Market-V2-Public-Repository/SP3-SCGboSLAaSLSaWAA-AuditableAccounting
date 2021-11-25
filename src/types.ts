export type InfoForRegistries = {
  id: number;
  hash: string;
  indexRepo: number;
};

export type InfoForTransactions = {
  txHash: string;
  nonce: number;
};

export type MerkleProofType = {
  hash: string;
  concatenateHashTo: string;
};
