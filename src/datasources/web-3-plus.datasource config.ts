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
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "root",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_root",
              "type": "uint256"
            }
          ],
          "name": "setRoot",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      address: process.env.WEB3_SC_ADDR,
    },
  ],
};
