export const config = {
  name: 'web3plus',
  connector: '@hardapps/lb-connector-web3plus',
  provider: process.env.WEB3_PROVIDER,
  providerName: process.env.WEB3_PROVIDER_NAME,
  privateKeyFile: './secrets.json',
  gas: Number(process.env.WEB3_GAS),
  contracts: [
    {
      name: 'Registry',
      abi: [
        {
          inputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'prevRootHash',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'currentRootHash',
              type: 'uint256',
            },
          ],
          name: 'newRegistry',
          type: 'event',
        },
        {
          constant: true,
          inputs: [],
          name: 'currentRoot',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'uint256',
              name: '_newRoot',
              type: 'uint256',
            },
          ],
          name: 'setNewRegistry',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      address: process.env.WEB3_SC_ADDR,
    },
  ],
};
