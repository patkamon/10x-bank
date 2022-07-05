require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const { WALLET_PRIVATE_KEY,ALCHEMY } = process.env;

module.exports = {
  defaultNetwork: "goerli",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    goerli: {
      url: `${ALCHEMY}`,
      accounts: [`0x${WALLET_PRIVATE_KEY}`]
    }
  },
  solidity: "0.8.1",
};

