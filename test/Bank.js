const { expect } = require("chai");
const { ethers } = require("hardhat");
const {constants, BN} = require('@openzeppelin/test-helpers');

describe("Bank contract", function () {
    let accounts, owner, bank, token;
    let initialBalance = ethers.utils.parseUnits("1", 18)

    beforeEach(async function () {    
        const Token = await ethers.getContractFactory("Token");
        const Bank = await ethers.getContractFactory("Bank");

        accounts = await ethers.getSigners();
        owner = accounts[0];

        token = await Token.deploy("testing","10X");
        bank = await Bank.deploy();

        for(let i=0; i<5; i++) {
            await token.transfer(accounts[i].address,  initialBalance); 
        }

    });

    it("create account with unique name", async function () {
        // there is not exist an account with name 'Patlom'
        expect(await bank.accounts("Patlom")).to.equal(constants.ZERO_ADDRESS); 
        // create an account with name 'Patlom'
        await bank.createAccount("Patlom");
        // find address for Patlom account store it in address
        address = await bank.accounts("Patlom")
        // address must not equal to null
        expect(address).to.not.equal(constants.ZERO_ADDRESS); 
        // check basic account info
        patlom = await ethers.getContractAt("Account", address);
        expect(await patlom.name()).to.equal("Patlom"); 
        expect(await patlom.owner()).to.equal(owner.address); 
    });


    it("deposit ERC20 to account",async function () {
        //create mock account
        await bank.connect(owner).createAccount("Patlom");
        address = await bank.accounts("Patlom")
        patlom = await ethers.getContractAt("Account", address);
        // expect mock account to does not has token
        expect(await patlom.tokenToAmount(token.address)).to.equal(constants.ZERO_ADDRESS); 
        // approve + deposit to account given name of account
        await token.connect(owner).approve(patlom.address, initialBalance); 
        await bank.connect(owner).deposit("Patlom", token.address, initialBalance)
        // expect it to have token with same amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(initialBalance); 
    })


    // TODO: withdraw ERC20 from account
    it("withdraw ERC20 from account",async function () {
        //create mock account
        await bank.connect(owner).createAccount("Patlom");
        address = await bank.accounts("Patlom")
        patlom = await ethers.getContractAt("Account", address);
        // approve + deposit to account given name of account
        await token.connect(owner).approve(patlom.address, initialBalance); 
        await bank.connect(owner).deposit("Patlom", token.address, initialBalance)
        // expect it to have token with same amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(initialBalance); 
        // do withdraw
        await bank.connect(owner).withdraw("Patlom", token.address, initialBalance)
        // expect it to has zero amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(0); 
    })


    // TODO: transfer to another account by account's name
        it("transfer to another account by account's name",async function () {
        //create mock account
        await bank.connect(owner).createAccount("Patlom");
        address1 = await bank.accounts("Patlom")
        patlom = await ethers.getContractAt("Account", address1);
        //create mock account
        await bank.connect(owner).createAccount("Bounk");
        address2 = await bank.accounts("Bounk")
        bounk = await ethers.getContractAt("Account", address2);

        // approve + deposit to account given name of account
        await token.connect(owner).approve(patlom.address, initialBalance); 
        await bank.connect(owner).deposit("Patlom", token.address, initialBalance)

        // expect it to have token with same amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(initialBalance); 
        expect(await bounk.tokenToAmount(token.address)).to.equal(constants.ZERO_ADDRESS); 
        // do transfer
        await bank.connect(owner).transfer("Patlom", token.address,"Bounk", initialBalance)
        // expect it to has zero amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(0); 
        expect(await bounk.tokenToAmount(token.address)).to.equal(initialBalance); 
    })
     
    // TODO: fee(1%) when transfer between 2 different account that does not has same owner
    it("fee(1%) when transfer between 2 different account ",async function () {
        // create mock account
        await bank.connect(owner).createAccount("Patlom");
        address1 = await bank.accounts("Patlom")
        patlom = await ethers.getContractAt("Account", address1);
        //create mock account
        await bank.connect(accounts[1]).createAccount("Bounk");
        address2 = await bank.accounts("Bounk")
        bounk = await ethers.getContractAt("Account", address2);

        // approve + deposit to account given name of account
        await token.connect(owner).approve(patlom.address, initialBalance); 
        await bank.connect(owner).deposit("Patlom", token.address, initialBalance)

        // expect it to have token with same amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(initialBalance); 
        expect(await bounk.tokenToAmount(token.address)).to.equal(constants.ZERO_ADDRESS); 
        // do transfer
        await bank.connect(owner).transfer("Patlom", token.address,"Bounk", initialBalance)
        // expect it to has zero amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(0); 
        expect(await bounk.tokenToAmount(token.address)).to.not.equal(initialBalance); 
    })
     
    // TODO: multiple transfer
    it("multiple transfer ",async function () {
        let balance2 = ethers.utils.parseUnits("2", 18)
        // create mock account
        await bank.connect(owner).createAccount("Patlom");
        address1 = await bank.accounts("Patlom")
        patlom = await ethers.getContractAt("Account", address1);
        // 
        await bank.connect(owner).createAccount("Beam");
        address2 = await bank.accounts("Beam")
        beam = await ethers.getContractAt("Account", address2);
        // create mock account
        await bank.connect(accounts[1]).createAccount("Bounk");
        address3 = await bank.accounts("Bounk")
        bounk = await ethers.getContractAt("Account", address3);

        // approve + deposit to account given name of account
        await token.connect(owner).approve(patlom.address, balance2); 
        await bank.connect(owner).deposit("Patlom", token.address, balance2)

        // expect it to have token with same amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(balance2); 
        expect(await beam.tokenToAmount(token.address)).to.equal(constants.ZERO_ADDRESS); 
        expect(await bounk.tokenToAmount(token.address)).to.equal(constants.ZERO_ADDRESS);

        tokenList = [token.address, token.address]
        toList = ["Bounk", "Beam"]
        amountList = [initialBalance,initialBalance]

        // do transfer
        await bank.connect(owner).multipleTransfer("Patlom", tokenList, toList, amountList)
        // expect it to has zero amount
        expect(await patlom.tokenToAmount(token.address)).to.equal(0); 
        expect(await bounk.tokenToAmount(token.address)).to.not.equal(initialBalance); 
        expect(await beam.tokenToAmount(token.address)).to.equal(initialBalance); 
  
    })
     


});