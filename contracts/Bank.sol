// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Account.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
contract Bank {
    mapping(string => Account) private accounts;

    function createAccount(string calldata name)
        public
        returns (address _account)
    {
        require(address(accounts[name]) == address(0), "Name already in used");
        accounts[name] = new Account(name, tx.origin);
        address _account = address(accounts[name]);
        return _account;
    }

    function deposit(
        string memory name,
        address token,
        uint256 amount
    ) external payable {
        require(address(accounts[name]) != address(0), "Not found account!");
        Account acc = accounts[name];
        acc.deposit(token, amount);
    }

    function withdraw(
        string memory name,
        address token,
        uint256 amount
    ) external payable {
        require(address(accounts[name]) != address(0), "Not found account!");
        Account acc = accounts[name];
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
        Account acc = accounts[name];
        Account to = accounts[_to];
        if (to.owner() != tx.origin) {
            uint256 fee = (amount / 100);
            amount = amount - fee;
        }
        acc.transfer(token, address(to), amount);
    }

    function multipleTranfer(
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
        Account acc = accounts[name];

        for (uint256 i = 0; i < _to.length; i++) {
            Account to = accounts[_to[i]];
            uint256 amount = _amount[i];
            if (to.owner() != tx.origin) {
                uint256 fee = (_amount[i] / 100);
                uint256 amount = amount - fee;
            }
            acc.transfer(token[i], address(to), amount);
        }
        // acc.multipleTranfer(token, to, amount);
    }
}
