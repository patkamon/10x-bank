// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Account.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Bank {
    // mapping(string => Account) public accounts;
    mapping(string => address) public accounts;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function createAccount(string memory name)
        public
        returns (address _account)
    {
        require(address(accounts[name]) == address(0), "Name already in used");
        accounts[name] = address(new Account(name, tx.origin));
        return accounts[name];
    }

    function deposit(
        string memory name,
        address token,
        uint256 amount
    ) external payable {
        require(address(accounts[name]) != address(0), "Not found account!");
        Account acc = Account(accounts[name]);
        acc.deposit(token, amount);
    }

    function withdraw(
        string memory name,
        address token,
        uint256 amount
    ) external payable {
        require(address(accounts[name]) != address(0), "Not found account!");
        Account acc = Account(accounts[name]);
        acc.withdraw(token, amount);
    }

    function transfer(
        string memory name,
        address token,
        string memory _to,
        uint256 amount
    ) public payable {
        require(address(accounts[name]) != address(0), "Not found account!");
        require(
            address(accounts[_to]) != address(0),
            "Not found account to send to!"
        );
        Account acc = Account(accounts[name]);
        Account to = Account(accounts[_to]);
        if (to.owner() != tx.origin) {
            uint256 fee = (amount / 100);
            amount = amount - fee;
            acc.transfer(token, owner, fee);
        }
        acc.transfer(token, address(to), amount);
        // extra
        to.setTokenToAmount(token, amount);
    }

    function multipleTransfer(
        string memory name,
        address[] memory token,
        string[] memory _to,
        uint256[] memory _amount
    ) public payable {
        require(address(accounts[name]) != address(0), "Not found account!");
        require(
            token.length == _to.length,
            "Parameters is not related to each other(length)!!"
        );
        require(
            token.length == _amount.length,
            "Parameters is not related to each other(length)!!"
        );
        require(token.length <= 150, "Length is exceed limit(150)!!");
        Account acc = Account(accounts[name]);

        for (uint256 i = 0; i < _to.length; i++) {
            Account to = Account(accounts[_to[i]]);
            uint256 amount = _amount[i];
            if (to.owner() != tx.origin) {
                uint256 fee = (amount / 100);
                amount = amount - fee;
                acc.transfer(token[i], owner, fee);
            }
            acc.transfer(token[i], address(to), amount);
            to.setTokenToAmount(token[i], amount);
        }
    }
}
