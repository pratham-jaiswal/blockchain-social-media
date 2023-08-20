require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(['8299690418da4d8ed1f6899808af9afb4ef60138ef8ce1e7acb9666569e65782'], `https://goerli.infura.io/v3/${process.env.REACT_APP_PROJECT_ID}`)
      },
      network_id: '5',
      gas: 4465030,
      gasPrice: 10000000000,
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.19",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}