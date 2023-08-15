// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract Wallet{
    address payable public owner;
    // payable constructor can recieve ethers
    constructor() payable {
        owner=payable(msg.sender);
    }
    struct transaction{
        address from;
        address to;
        string operation;
        uint amount;
        uint timestamp;
    }
    // event Transaction(address indexed from,address indexed to,uint value);
    transaction[] transactions;
    // this functiin can also recieve ethers
    function getOwner()public view returns(address){
        return owner;
    }
    mapping (address=>uint) balances;
    // this functiin can also recieve ethers
    function deposit() public payable {
        balances[msg.sender]+=msg.value;
        transactions.push(transaction(msg.sender,address(this),"Deposit",msg.value,block.timestamp));
        // emit Transaction(msg.sender, address(this), msg.value);
    }
    function getBalances()public view returns(uint){
        return balances[msg.sender];
    }
    function withdraw() public {
        require(balances[msg.sender]>0,"Account is Empty");
        uint amount=balances[msg.sender];
        balances[msg.sender]-=amount;
        (bool success,)=msg.sender.call{value:amount}("amount withdrawn froom smart contarct");
        require(success, "failed to recieve ether");
        transactions.push(transaction(address(this),msg.sender,"Withdraw",amount,block.timestamp));
        // emit Transaction(address(this), msg.sender, amount);
    }
    function transfer(address payable _to,uint _amount) public{
        require(balances[msg.sender]>=_amount,"you dont have enough balance");
        balances[msg.sender]-=_amount;
        (bool success,)=_to.call{value:_amount}("ether transfered");
        require(success,"failed");
        transactions.push(transaction(msg.sender,_to,"Transfer",_amount,block.timestamp));
        // emit Transaction(msg.sender,_to, _amount);
    } 
    function getTransaction()public view returns(transaction[] memory) {
        return transactions;
    }
}