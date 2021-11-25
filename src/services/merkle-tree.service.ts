import Web3Utils from 'web3-utils';
import {MerkleProofType} from '../types';

export class MerkleTreeService {
  constructor() {}

  /**
   * Calculates Merkle Root
   * @param leafNodes Vector containing all the leafs of the tree
   */
  tree(leafNodes: Array<string>): Array<string> {
    const numberOfNodes: number = leafNodes.length;
    const depthTree: number =
      leafNodes.length === 1 ? 1 : Math.ceil(Math.log2(numberOfNodes));

    const zero =
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    //Es podria canviar a un random (not clear)

    let merkleTreeNodes: Array<string> = [...leafNodes];

    while (merkleTreeNodes.length < Math.pow(2, depthTree)) {
      merkleTreeNodes.push(zero);
    }

    for (let i = depthTree - 1; i > 0; --i) {
      let upperLevelNodes = [];
      for (let j = 0; j < Math.pow(2, i + 1); j += 2) {
        const node = Web3Utils.keccak256(
          merkleTreeNodes[j] + merkleTreeNodes[j + 1],
        );
        upperLevelNodes.push(node);
      }
      merkleTreeNodes.unshift(...upperLevelNodes);
    }

    const root = Web3Utils.keccak256(
      merkleTreeNodes[0] + depthTree.toString() + merkleTreeNodes[1],
    );
    merkleTreeNodes.unshift(root);
    return merkleTreeNodes;
  }

  /**
   * Calculates the Merkle Proof for a given node
   * @param fullTree Vector containing all the nodes of the tree
   * @param node Node that we are calculating its merkle Proof
   */
  proof(fullTree: Array<string>, node: string): MerkleProofType[] {
    let position = fullTree.indexOf(node);
    const MerkleProof: MerkleProofType[] = [];
    let index: number;
    while (position > 2) {
      index = position % 2 === 0 ? position - 1 : position + 1; //The proof element is rightside or leftside?
      //If the element is rightside, we add the left one and specifies it in order to do the validation proof
      //correctly because (hash(a,b) != hash(b,a))

      //const complementary = fullTree[index] === zero ? fullTree[position] : fullTree[index];
      const complementary = fullTree[index];

      const concatenateHashTo = index === position - 1 ? 'left' : 'right';
      MerkleProof.push({hash: complementary, concatenateHashTo});

      position = position % 2 === 0 ? position / 2 - 1 : (position - 1) / 2;
    }

    const depth = Math.floor(Math.log2(fullTree.length));
    const concatenateHashTo = position === 2 ? 'left' : 'right';
    const hash =
      position === 2
        ? fullTree[1] + depth.toString()
        : depth.toString() + fullTree[2];

    MerkleProof.push({hash, concatenateHashTo});

    return MerkleProof;
  }
}
