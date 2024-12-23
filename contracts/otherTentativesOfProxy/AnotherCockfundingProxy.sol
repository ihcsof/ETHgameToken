// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./CockfundingToken.sol";

contract CockfundingProxy is ERC20, Ownable, Pausable {
    address payable public targetContract;

    uint256 public immutable tokenPrice;        // Price of one token in wei (ETH)
    uint256 public totalRaised;                 // Total amount of ETH raised for the cock project
    uint256 public immutable softCap;           // Minimum amount of ETH required for cock success
    uint256 public immutable deadline;          // Timestamp after which cock ICO can be finalized
    uint256 public immutable minContribution;   // To avoid cluttering!

    bool public isFinalized;          // Has the cock ICO been finalized?
    bool public isSuccessful;         // Hopefully Cock Fight Sim will meet the soft cap!

    uint256 public immutable earlyBirdBonus;    // Bonus percentage for early birds
    uint256 public immutable earlyBirdDuration; // Early bird period

    // Tracks ETH contributions for EACH address
    mapping(address => uint256) public contributions;

    // Leaderboard variables (Fixed top 5 contributors!)
    uint256 public constant leaderboardSize = 5;
    address[leaderboardSize] public leaderboardAddresses;
    uint256[leaderboardSize] public leaderboardContributions;

    constructor(address payable _targetContract, uint256 _tokenPrice, uint256 _softCap, uint256 _duration, uint256 _earlyBirdBonus, uint256 _earlyBirdDuration, uint256 _minContribution) 
        ERC20("CockFundingToken", "CFT")
        Ownable(msg.sender)
    {
        targetContract = _targetContract;

        require(_tokenPrice > 0, "Cock price deserves to be more than zero ETH!");
        require(_softCap > 0, "The Cock project needs more than zero ETH to reach its success :(");
        require(_duration > 0, "The Cock project needs more time than zero seconds to... grow");

        tokenPrice = _tokenPrice;
        softCap = _softCap;
        deadline = block.timestamp + _duration; // start from... now!

        require(_earlyBirdDuration < _duration, "Early bird duration must be shorter than ICO duration");
        earlyBirdBonus = _earlyBirdBonus;
        earlyBirdDuration = _earlyBirdDuration;

        require(_minContribution > 0, "You can't send 0 tokens!");
        minContribution = _minContribution;

        // Mint tokens to the contract for sale (for simplicity, a fixed supply)
        _mint(address(this), 1_069_069 * 10 ** decimals());
    }

    function upgrade(address payable _newTargetContract) external onlyOwner {
        targetContract = _newTargetContract;
    }

    receive() external payable whenNotPaused {
        buyTokens();
    }

    function pause() external onlyOwner {
        targetContract.delegatecall(abi.encodeWithSignature("pause()"));
    }

    function unpause() external onlyOwner {
        targetContract.delegatecall(abi.encodeWithSignature("unpause()"));
    }

    function buyTokens() public payable whenNotPaused {
        targetContract.delegatecall(abi.encodeWithSignature("buyTokens()"));
    }

    function finalize() external onlyOwner {
        targetContract.delegatecall(abi.encodeWithSignature("finalize()"));
    }

    function claimRefund() external {
        targetContract.delegatecall(abi.encodeWithSignature("claimRefund()"));
    }

    function withdrawRemainingTokens() external onlyOwner {
        targetContract.delegatecall(abi.encodeWithSignature("withdrawRemainingTokens()"));
    }

    function timeUntilDeadline() external returns (uint256) {
        (bool success, bytes memory data) = targetContract.delegatecall(abi.encodeWithSignature("timeUntilDeadline()"));
        require(success, "Delegatecall failed");
        return abi.decode(data, (uint256));   
    }

    function tokensRemaining() external returns (uint256) {
        (bool success, bytes memory data) = targetContract.delegatecall(abi.encodeWithSignature("tokensRemaining()"));
        require(success, "Delegatecall failed");
        return abi.decode(data, (uint256)); 
    }

    function contributionDetails(address contributor) external returns (uint256 contributionAmount, uint256 tokenEquivalent) {
        (bool success, bytes memory data) = targetContract.delegatecall(
            abi.encodeWithSignature("contributionDetails(address)", contributor)
        );
        require(success, "Delegatecall failed");
        (contributionAmount, tokenEquivalent) = abi.decode(data, (uint256, uint256));
    }

    // Function to get tokens for the provided ETH amount
    function tokensForEth(uint256 ethAmount) external returns (uint256) {
        (bool success, bytes memory data) = targetContract.delegatecall(
            abi.encodeWithSignature("tokensForEth(uint256)", ethAmount)
        );
        require(success, "Delegatecall failed");
        return abi.decode(data, (uint256));
    }

    // Function to get the leaderboard with the top 5 addresses and their scores
    function getLeaderboard() external returns (address[5] memory, uint256[5] memory) {
        (bool success, bytes memory data) = targetContract.delegatecall(
            abi.encodeWithSignature("getLeaderboard()")
        );
        require(success, "Delegatecall failed");
        (address[5] memory leaderboardAddresses, uint256[5] memory leaderboardScores) = abi.decode(data, (address[5], uint256[5]));
        return (leaderboardAddresses, leaderboardScores);
    }

    // Function to get contract details such as balances, limits, and contract state
    function getContractDetails() external returns (uint256, uint256, uint256, uint256, uint256, bool) {
        (bool success, bytes memory data) = targetContract.delegatecall(
            abi.encodeWithSignature("getContractDetails()")
        );
        require(success, "Delegatecall failed");
        (uint256 detail1, uint256 detail2, uint256 detail3, uint256 detail4, uint256 detail5, bool activeStatus) = abi.decode(data, (uint256, uint256, uint256, uint256, uint256, bool));
        return (detail1, detail2, detail3, detail4, detail5, activeStatus);
    }


}