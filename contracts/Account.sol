// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Account {
    address[] public tokens;
    mapping(address => uint256) public tokenToAmount;
    string public name;
    address public owner;

    constructor(string memory _name, address _owner) public {
        // only owner will be able to do some task.
        name = _name;
        owner = _owner;
    }

    function getAllTokens() public view returns (address[] memory) {
        return tokens;
    }

    function getTokenAmount(address _a) public view returns (uint256) {
        return tokenToAmount[_a];
    }

    function deposit(address token, uint256 amount) external payable {
        require(tx.origin == owner, "You are not owner of this account!");
        require(amount > 0, "Amount must be greater than 0!!");
        // transfer
        ERC20 contractToken = ERC20(token);
        require(
            contractToken.allowance(tx.origin, address(this)) >= amount,
            "Not allow yet!!"
        );
        require(
            contractToken.balanceOf(tx.origin) >= amount,
            "Do not have this amount of token"
        );
        contractToken.transferFrom(tx.origin, address(this), amount);
        // in case not involve with this token before
        if (tokenToAmount[token] == 0) {
            tokens.push(token);
        }
        tokenToAmount[token] += amount;
    }

    function withdraw(address token, uint256 amount) external payable {
        require(tx.origin == owner, "You are not owner of this account!");
        require(amount > 0, "Amount must be greater than 0!!");
        require(tokenToAmount[token] > 0, "You dont have this token!!");
        require(tokenToAmount[token] >= amount, "Amount exceed your balance!!");
        // transfer
        ERC20 contractToken = ERC20(token);
        contractToken.transfer(tx.origin, amount);
        tokenToAmount[token] -= amount;
    }

    function transfer(
        address token,
        address to,
        uint256 amount
    ) external payable {
        require(tx.origin == owner, "You are not owner of this account!");
        require(amount > 0, "Amount must be greater than 0!!");
        require(tokenToAmount[token] > 0, "You dont have this token!!");
        require(tokenToAmount[token] >= amount, "Amount exceed your balance!!");
        // transfer
        ERC20 contractToken = ERC20(token);
        contractToken.transfer(to, amount);
        tokenToAmount[token] -= amount;
    }

    function setTokenToAmount(address token, uint256 amount) public {
        if (tokenToAmount[token] == 0) {
            tokens.push(token);
        }
        tokenToAmount[token] += amount;
    }
}
