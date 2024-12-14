/*
    Smart contract for the CrowdFunding of our (real) videogame: Cock Fight Simulator!
    
    ... behold! Cock stands for Rooster!
    You can check if you're unsure: https://store.steampowered.com/app/3330460/Cock_Fight_Simulator/

*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// Using OpenZeppelin's standard ERC20 implementation
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract CockfundingToken is ERC20, Ownable, Pausable {
    uint256 public tokenPrice;        // Price of one token in wei (ETH)
    uint256 public totalRaised;       // Total amount of ETH raised for the cock project
    uint256 public softCap;           // Minimum amount of ETH required for cock success
    uint256 public deadline;          // Timestamp after which cock ICO can be finalized

    bool public isFinalized;          // Has the cock ICO been finalized?
    bool public isSuccessful;         // Hopefully Cock Fight Sim will meet the soft cap!

    // Tracks ETH contributions for EACH address
    mapping(address => uint256) public contributions;

    // Raising events it's important for both logging and for off-chain integrations
    /*
        From ChatGPT:
            Efficient Data Retrieval:
                Instead of continuously polling the blockchain for the latest contract state (which can be expensive and slow), 
                off-chain applications can subscribe to the contract’s event logs. 
                These logs are stored in a more cost-efficient area of the Ethereum ledger, allowing external systems 
                (like front-ends, servers, or third-party applications) to quickly and cheaply detect relevant changes.

            Indexed and Searchable:
                Events on the Ethereum blockchain are indexed by topic. 
                This makes it easy for off-chain services and user interfaces to filter and search for specific occurrences 

            Push Model Instead of Pull:
                Events follow a publish-subscribe model. 
                Off-chain listeners can subscribe to specific events and be “pushed” data as soon as it’s available. 
                This reduces complexity for developers since they don’t have to continuously pull and re-parse contract states.

    */
    event TokensPurchased(address indexed buyer, uint256 amountSpent, uint256 tokensReceived);
    event Refunded(address indexed buyer, uint256 amount);
    event Finalized(bool successful);
    event Withdrawal(address indexed owner, uint256 amount);

    /*
     Constructor sets token details and initial conditions, with following params:
        _tokenPrice The price of a single token in wei
        _softCap The minimum amount of ETH required for the cock to be successful.
        _duration The (seconds) duration for which the cock ICO will remain active.
    */
    constructor(uint256 _tokenPrice, uint256 _softCap, uint256 _duration) 
        ERC20("CockFundingToken", "CFT")
        Ownable(msg.sender)
    {
        require(_tokenPrice > 0, "Cock price deserves to be more than zero ETH!");
        require(_softCap > 0, "The Cock project needs more than zero ETH to reach its success :(");
        require(_duration > 0, "The Cock project needs more time than zero seconds to... grow");

        tokenPrice = _tokenPrice;
        softCap = _softCap;
        deadline = block.timestamp + _duration; // start from... now!
        
        // Mint tokens to the contract for sale (for simplicity, a fixed supply)
        _mint(address(this), 1_069_069 * 10 ** decimals());
    }

    /*
     EMERGENCY! The ICO can be paused.
     While paused, no one can buy tokens.
    */
    function pause() external onlyOwner {
        _pause();
    }

    /*
     Allows the owner to resume the ICO once the emergency is resolved :)
    */
    function unpause() external onlyOwner {
        _unpause();
    }

    /*
     Fallback function to allow direct ETH payment to buy tokens.
        aka when someone sends ETH to this contract without specifying any 
        specific function to execute, it will automatically run the receive function
    */
    receive() external payable whenNotPaused {
        buyTokens();
    }


    // Allows users to buy tokens at the set price until the deadline or finalization.
    function buyTokens() public payable whenNotPaused {
        require(!isFinalized, "ICO already finalized!");
        require(block.timestamp <= deadline, "ICO duration is over");
        require(msg.value > 0, "Send ETH to buy tokens");

        uint256 tokenAmount = msg.value / tokenPrice;
        require(tokenAmount > 0, "No Cock for you ^_^");
        require(balanceOf(address(this)) >= tokenAmount, "Holy, u poor");

        totalRaised += msg.value;
        contributions[msg.sender] += msg.value;

        _transfer(address(this), msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    /*
     Allows the owner to finalize the ICO after the deadline.
        If the soft cap is reached or exceeded, ETH is transferred to the owner: 
            the Cock project has.. ehm.. is finished!
        If not, contributors can claim refunds:
            the Cock project didn't last for so long...
    */
    function finalize() public onlyOwner {
        require(!isFinalized, "Already finalized");
        require(block.timestamp >= deadline, "C'mon we can't finish prematurely!");

        isFinalized = true;
        if (totalRaised >= softCap) {
            // SUCCESS: transfer all raised funds to the owner
            isSuccessful = true;
            uint256 amount = address(this).balance;

            // We pass an empty bytes array ti save gas (so we ignore the second output)
            (bool success, ) = owner().call{value: amount}("");

            require(success, "Oh no! Transfer to owner failed");

            emit Withdrawal(owner(), amount);
        } else
            // FAIL: Contributors will be able to claim refunds :(
            isSuccessful = false;

        emit Finalized(isSuccessful);
    }

    /*
     Even if we would like to run away with all the money...
        Allow contributors to claim a refund if the ICO failed.
        ( Can only be called after finalization if softCap wasn't met )
    */
    function claimRefund() public {
        require(isFinalized, "Hold up! Not so fast :'(");
        require(!isSuccessful, "ICO was successful, go play with Cocks!");
        
        uint256 contribution = contributions[msg.sender];
        require(contribution > 0, "No contributions to refund, u don't fool us!");

        // As seen in lesson, let's put the value at zero BEFORE the claim!
        contributions[msg.sender] = 0;

        // For a genoese person this is the worst part
        (bool success, ) = msg.sender.call{value: contribution}("");
        require(success, "Refund transfer failed");

        emit Refunded(msg.sender, contribution);
    }

    /*
     Allows owner to withdraw any leftover tokens after finalization if needed.
        aka it transfers remaining tokens from the contract back to its owner
    */
    function withdrawRemainingTokens() external onlyOwner {
        require(isFinalized, "ICO not finalized");
        uint256 remaining = balanceOf(address(this));
        require(remaining > 0, "No remaining tokens");
        _transfer(address(this), owner(), remaining);
    }

    /*
     Returns the remaining seconds until the deadline.
     If already past the deadline, returns 0.
    */
    function timeUntilDeadline() external view returns (uint256) {
        if (block.timestamp >= deadline)
            return 0;
    
        return deadline - block.timestamp;
    }

    /*
     Returns how many tokens are remaining for sale in the contract.
    */
    function tokensRemaining() external view returns (uint256) {
        return balanceOf(address(this));
    }

    /*
     Returns both the ETH contribution of a given contributor and the 
     equivalent amount of tokens they would have received at the current token price.
    */
    function contributionDetails(address contributor) external view returns (uint256 contributionAmount, uint256 tokenEquivalent) {
        contributionAmount = contributions[contributor];
        tokenEquivalent = contributionAmount / tokenPrice;
    }

     /*
     Returns how many tokens a user would get for a given amount of ETH.
        --> to help frontend showing expected tokens before the user sends ETH.
    */
    function tokensForEth(uint256 ethAmount) external view returns (uint256) {
        return ethAmount / tokenPrice;
    }

}
