import {CSMT} from "@i3m/vdi/dist/services/csmt";
import {DataSource, Proof} from "@i3m/vdi/dist/models/models";

export class MerkleTreeService {
  constructor() {}

  /**
   * Calculates Merkle Root
   * @param hashes Array of hashes
   */
  tree(hashes: Array<string>): CSMT {
    let tree = new CSMT(false);

    let dataSource = hashes.map(hash => new DataSource(this.hexToBytes(hash)));

    tree.insert(dataSource);

    return tree;
  }

  /**
   * Calculates the Merkle Proof for a given hash
   * @param tree tree object
   * @param hash hash value to generate the proof
   */
   proof(tree: CSMT, hash: string): Proof {
     return tree.createProof(this.hexToBytes(hash));
  }

  private hexToBytes(hex: string) : Array<number> {
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
}
