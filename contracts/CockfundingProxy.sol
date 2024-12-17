// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./CockfundingToken.sol";

contract CockfundingProxy is Ownable, Pausable {
    address payable public targetContract;

    constructor(address payable _targetContract) Ownable(msg.sender) {
        targetContract = _targetContract;
    }

    function upgrade(address payable _newTargetContract) external onlyOwner {
        targetContract = _newTargetContract;
    }

    fallback() external payable {
        // Forward all calls to the target contract
        address _impl = targetContract;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
                case 0 { revert(0, returndatasize()) }
                default { return(0, returndatasize()) }
        }
    }

    receive() external payable whenNotPaused {
        buyTokens();
    }

    function pause() external onlyOwner {
        return CockfundingToken(targetContract).pause();
    }

    function unpause() external onlyOwner {
        return CockfundingToken(targetContract).unpause();
    }

    function buyTokens() public payable whenNotPaused {
        return CockfundingToken(targetContract).buyTokens{value: msg.value}();
    }

    function finalize() external onlyOwner {
        return CockfundingToken(targetContract).finalize();
    }

    function claimRefund() external {
        return CockfundingToken(targetContract).claimRefund();
    }

    function withdrawRemainingTokens() external onlyOwner {
        return CockfundingToken(targetContract).withdrawRemainingTokens();
    }

    function timeUntilDeadline() external view returns (uint256) {
        return CockfundingToken(targetContract).timeUntilDeadline();
    }

    function tokensRemaining() external view returns (uint256) {
        return CockfundingToken(targetContract).tokensRemaining();
    }

    function contributionDetails(address contributor) external view returns (uint256 contributionAmount, uint256 tokenEquivalent) {
        return CockfundingToken(targetContract).contributionDetails(contributor);
    }

    function tokensForEth(uint256 ethAmount) external view returns (uint256) {
        return CockfundingToken(targetContract).tokensForEth(ethAmount);
    }

    function getLeaderboard() external view returns (address[5] memory, uint256[5] memory) {
        return CockfundingToken(targetContract).getLeaderboard();
    }

    function getContractDetails() external view returns (uint256, uint256, uint256, uint256, uint256, bool) {
        return CockfundingToken(targetContract).getContractDetails();
    }

}