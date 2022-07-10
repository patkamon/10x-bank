const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("@openzeppelin/test-helpers");

describe("Transfer Revert test", function () {
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

    await token.connect(owner).approve(patlom.address, initialBalance);
    await bank.connect(owner).deposit("Patlom", token.address, initialBalance);
  });

  it("transfer non exist account", async function () {
    await expect(
      bank
        .connect(owner)
        .transfer("NonExist", token.address, "Patlom", initialBalance)
    ).to.be.revertedWith("Not found account!");
  });

  it("transfer to non exist account", async function () {
    await expect(
      bank
        .connect(owner)
        .transfer("Patlom", token.address, "NonExist", initialBalance)
    ).to.be.revertedWith("Not found account to send to!");
  });

  it("transfer to other account that not your", async function () {
    await expect(
      bank
        .connect(accounts[1])
        .transfer("Patlom", token.address, "Bounk", initialBalance)
    ).to.be.revertedWith("You are not owner of this account!");
  });

  it("transfer zero amount", async function () {
    await expect(
      bank.connect(owner).transfer("Patlom", token.address, "Bounk", 0)
    ).to.be.revertedWith("Amount must be greater than 0!!");
  });

  it("transfer token that you not have", async function () {
    await expect(
      bank
        .connect(owner)
        .transfer("Bounk", token.address, "Patlom", initialBalance)
    ).to.be.revertedWith("You dont have this token!!");
  });

  it("transfer exceed balance", async function () {
    await expect(
      bank.connect(owner).transfer("Patlom", token.address, "Bounk", balance2)
    ).to.be.revertedWith("Amount exceed your balance!!");
  });
});
