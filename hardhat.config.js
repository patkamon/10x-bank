require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const { WALLET_PRIVATE_KEY,ALCHEMY } = process.env;

module.exports = {
    defaultNetwork: "hardhat",
  solidity: "0.8.0",
  paths: {
    artifacts: "./pages/artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
            url: `${ALCHEMY}`,
            accounts: [`0x${WALLET_PRIVATE_KEY}`]
          }
  }
}