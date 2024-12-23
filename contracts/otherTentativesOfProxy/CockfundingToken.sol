// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./CockfundingTokenStorage.sol";

/**
 * @title CockfundingImplementation
 * @notice Contains the actual ICO logic. Inherits from Storage so it can
 *         read/write the variables that actually live in the proxy.
 */
contract CockfundingImplementation is CockfundingTokenStorage, ERC20, Ownable, Pausable {
    /**
     * @dev Instead of a constructor, we use `initialize()`.
     *      The proxy will call this once, so that the storage
     *      in the proxy gets initialized correctly.
     */
    constructor () ERC20("CockFundingToken", "CFT") Ownable(msg.sender) {
    }
    function initialize(
        uint256 _tokenPrice,
        uint256 _softCap,
        uint256 _duration,
        uint256 _earlyBirdBonus,
        uint256 _earlyBirdDuration,
        uint256 _minContribution,
        address owner_
    ) external {
        require(!_initialized, "Already initialized");
        _initialized = true;

        // Setup initial values in proxy's storage
        tokenPrice = _tokenPrice;
        softCap = _softCap;
        deadline = block.timestamp + _duration;
        earlyBirdBonus = _earlyBirdBonus;
        earlyBirdDuration = _earlyBirdDuration;
        minContribution = _minContribution;
        isFinalized = false;
        isSuccessful = false;

        // Typical pattern with Ownable upgradeable: manually set owner
        _transferOwnership(owner_);

        // The token name/symbol from ERC20 constructor:
        // For upgradeable ERC20, we can't do a normal constructor call, so we can do an internal
        // initialization. However, OpenZeppelin's ERC20 won't let you re-run the constructor.
        // Instead, consider using "ERC20Upgradeable" from OpenZeppelin’s upgradeable library.
        // For simplicity, let's do a hacky approach here:
        // (But if you're using the standard ERC20, you need a specialized pattern.)
    }

    // =========== Put your ICO logic below ===========
    // e.g. buyTokens, finalize, etc.

    function buyTokens() external payable whenNotPaused {
        require(!isFinalized, "ICO already finalized!");
        require(block.timestamp <= deadline, "ICO duration is over");
        require(msg.value >= minContribution, "Contribution is too small");

        // The rest of your logic for buyTokens...
        totalRaised += msg.value;
        contributions[msg.sender] += msg.value;
        
        // etc...
    }

    function finalize() external onlyOwner {
        require(!isFinalized, "Already finalized");
        require(block.timestamp >= deadline, "Cannot finalize yet");

        isFinalized = true;
        if (totalRaised >= softCap) {
            isSuccessful = true;
            // Transfer raised funds to owner
            (bool success, ) = owner().call{value: address(this).balance}("");
            require(success, "Transfer failed");
        } else {
            isSuccessful = false;
        }
    }
    
    // ... other functions (claimRefund, pause, unpause, etc.) ...
    
    // fallback/receive not needed here because the proxy will handle it

    // For demonstration, let's add a getter:
    function getState() external view returns (uint256, bool, bool) {
        return (totalRaised, isFinalized, isSuccessful);
    }
}
