# 10XBank

Assignment used for determine my knowledge and skill for **SCB10xBlockCamp2022**

# Test

for all tests (Included all revert tests)
`npx hardhat test`
for only main 6 tests
`npx hardhat test test/Bank.js`

# Getting Started

Incase you prefer goerli testnet you can skip to last step section

in `hardhat.config.js` add your prefer network
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

**last step:**

go to `pages/\_app.js` change `fau` value to your prefer erc20 token address and `bankAddress` (no need if you use goerli testnet) to new contract address.  
*If you change network consider changing `components/Navbar.js` line 27 to your prefer network chainID.*
