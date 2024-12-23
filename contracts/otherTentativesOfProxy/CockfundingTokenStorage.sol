// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
 * @dev This contract ONLY defines storage variables.
 *      It does NOT have any logic in it.
 */
contract CockfundingTokenStorage {
    // Core variables
    uint256 public tokenPrice;        
    uint256 public totalRaised;       
    uint256 public softCap;           
    uint256 public deadline;          
    uint256 public minContribution;   

    bool public isFinalized;          
    bool public isSuccessful;         

    uint256 public earlyBirdBonus;    
    uint256 public earlyBirdDuration;

    // Tracks ETH contributions for EACH address
    mapping(address => uint256) public contributions;

    // Leaderboard variables
    uint256 public constant leaderboardSize = 5;
    address[leaderboardSize] public leaderboardAddresses;
    uint256[leaderboardSize] public leaderboardContributions;

    // For checking if initialize() was called
    bool internal _initialized;
}
