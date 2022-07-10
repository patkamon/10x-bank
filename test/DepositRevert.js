const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("@openzeppelin/test-helpers");

describe("Deposit Revert test", function () {
  let accounts, owner, bank, token;
  let initialBalance = ethers.utils.parseUnits("1", 18);

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("Token");
    const Bank = await ethers.getContractFactory("Bank");

    accounts = await ethers.getSigners();
    owner = accounts[0];

    token = await Token.deploy("testing", "10X");
    bank = await Bank.deploy();

    for (let i = 0; i < 5; i++) {
      await token.transfer(accounts[i].address, initialBalance);
    }

    await bank.connect(owner).createAccount("Patlom");
    address1 = await bank.accounts("Patlom");
    patlom = await ethers.getContractAt("Account", address1);
  });

  it("create account with existing account name", async function () {
    await expect(
      bank.connect(owner).createAccount("Patlom")
    ).to.be.revertedWith("Name already in used");
  });

  it("deposit to non exist account", async function () {
    await expect(
      bank.connect(owner).deposit("NonExist", token.address, initialBalance)
    ).to.be.revertedWith("Not found account!");
  });

  it("deposit to non allow account", async function () {
    await expect(
      bank.connect(owner).deposit("Patlom", token.address, initialBalance)
    ).to.be.revertedWith("Not allow yet!!");
  });

  it("deposit to other account that not your", async function () {
    await expect(
      bank.connect(accounts[1]).deposit("Patlom", token.address, initialBalance)
    ).to.be.revertedWith("You are not owner of this account!");
  });

  it("deposit only 0", async function () {
    await expect(
      bank.connect(owner).deposit("Patlom", token.address, 0)
    ).to.be.revertedWith("Amount must be greater than 0!!");
  });
});
