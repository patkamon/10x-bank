# 10XBank

# Test

`npx hardhat test`

# Getting Started

in hardhat.config.js add your prefer network
don't forget add Alchemy link to your prefer network and your private key in `.env` file

```
networks: {
    hardhat: {
      chainId: 1337
    },
    prefernetwork: {
            url: `${ALCHEMY}`,
            accounts: [`0x${WALLET_PRIVATE_KEY}`]
          }
  }
```

next run

`npx hardhat run scripts/deploy.js --network prefernetwork`

to deploy bank contract don't forget to save contract address

then go to pages/\_app.js change `fau` value to your prefer erc20 token address and `bankAddress` to new contract address
