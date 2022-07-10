const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("@openzeppelin/test-helpers");

describe("Multiple Transfer Revert test", function () {
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

    await bank.connect(owner).createAccount("Bounk");
    address2 = await bank.accounts("Bounk");
    bounk = await ethers.getContractAt("Account", address2);

    await bank.connect(accounts[1]).createAccount("Beam");
    address3 = await bank.accounts("Beam");
    beam = await ethers.getContractAt("Account", address3);

    await token.connect(owner).approve(patlom.address, balance2);
    await bank.connect(owner).deposit("Patlom", token.address, balance2);

    tokenP = [token.address, token.address];
    toP = ["Bounk", "Beam"];
    amountP = [initialBalance, initialBalance];
  });

  it("transfer non exist account", async function () {
    await expect(
      bank.connect(owner).multipleTransfer("NonExist", tokenP, toP, amountP)
    ).to.be.revertedWith("Not found account!");
  });

  it("missing parameter1", async function () {
    missTo = ["Bounk"];
    await expect(
      bank.connect(owner).multipleTransfer("Patlom", tokenP, missTo, amountP)
    ).to.be.revertedWith("Parameters is not related to each other(length)!!");
  });
  it("missing parameter2", async function () {
    missAmount = [initialBalance];
    await expect(
      bank.connect(owner).multipleTransfer("Patlom", tokenP, toP, missAmount)
    ).to.be.revertedWith("Parameters is not related to each other(length)!!");
  });
});
