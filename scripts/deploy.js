const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  // const Token = await hre.ethers.getContractFactory("RICE");
  // const token = await Token.deploy('RICE', 'RICE');
  const Bank = await ethers.getContractFactory("Bank");
  bank = await Bank.deploy();

  console.log("Bank deployed to:", bank.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
