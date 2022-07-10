const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Withdraw Revert test", function () {
  let accounts, owner, bank, token;
  let initialBalance = ethers.utils.parseUnits("1", 18);
  let balance2 = ethers.utils.parseUnits("2", 18);

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
  it("withdraw to non exist account", async function () {
    await expect(
      bank.connect(owner).withdraw("NonExist", token.address, initialBalance)
    ).to.be.revertedWith("Not found account!");
  });
  it("withdraw to other account that not your", async function () {
    await expect(
      bank
        .connect(accounts[1])
        .withdraw("Patlom", token.address, initialBalance)
    ).to.be.revertedWith("You are not owner of this account!");
  });
  it("withdraw only 0", async function () {
    await expect(
      bank.connect(owner).withdraw("Patlom", token.address, 0)
    ).to.be.revertedWith("Amount must be greater than 0!!");
  });

  it("withdraw token that not have", async function () {
    await expect(
      bank.connect(owner).withdraw("Patlom", token.address, initialBalance)
    ).to.be.revertedWith("You dont have this token!!");
  });

  it("withdraw exceed token", async function () {
    await token.connect(owner).approve(patlom.address, initialBalance);
    await bank.connect(owner).deposit("Patlom", token.address, initialBalance);

    await expect(
      bank.connect(owner).withdraw("Patlom", token.address, balance2)
    ).to.be.revertedWith("Amount exceed your balance!!");
  });
});
