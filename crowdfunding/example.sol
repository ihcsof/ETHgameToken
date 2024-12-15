// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
    uint public goal;
    uint public totalFunds;
    mapping(address => uint) public contributions;

    event ContributionReceived(address contributor, uint amount);
    event FundsWithdrawn(address owner, uint amount);

    constructor(uint _goal) {
        owner = msg.sender;
        goal = _goal;
        totalFunds = 0;
    }

    function contribute() public payable {
        require(msg.value > 0, "Contribution must be greater than 0");
        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;
        emit ContributionReceived(msg.sender, msg.value);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw funds");
        require(totalFunds >= goal, "Goal not reached");
        payable(owner).transfer(totalFunds);
        emit FundsWithdrawn(owner, totalFunds);
    }

    function getContractDetails() public view returns (uint, uint, uint) {
        return (goal, totalFunds, address(this).balance);
    }
}
