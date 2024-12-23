// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CockfundingTokenStorage.sol";

/**
 * @title CockfundingProxy
 * @notice Minimal proxy that holds all storage,
 *         while delegating logic to CockfundingImplementation.
 */
contract CockfundingProxy is CockfundingTokenStorage {
    address public implementation;

    /**
     * @dev The constructor sets the logic contract and immediately initializes
     *      the storage by delegating the call to `initialize(...)`.
     */
    constructor(
        address _logic,
        uint256 _tokenPrice,
        uint256 _softCap,
        uint256 _duration,
        uint256 _earlyBirdBonus,
        uint256 _earlyBirdDuration,
        uint256 _minContribution,
        address _owner
    ) {
        implementation = _logic;

        // Now call initialize on the logic contract so that our storage is set up
        (bool success, ) = _logic.delegatecall(
            abi.encodeWithSignature(
                "initialize(uint256,uint256,uint256,uint256,uint256,uint256,address)",
                _tokenPrice,
                _softCap,
                _duration,
                _earlyBirdBonus,
                _earlyBirdDuration,
                _minContribution,
                _owner
            )
        );
        require(success, "Initialize failed");
    }

    /**
     * @dev You can add an upgrade function if you want, so the owner can upgrade
     *      the logic contract address in the future.
     */
    function upgradeTo(address newImplementation) external {
        // in production you'd add an onlyOwner check
        implementation = newImplementation;
    }

    /**
     * @dev The fallback that forwards all calls to the current implementation
     *      using DELEGATECALL. The implementation’s code executes *using this contract’s storage*.
     */
    fallback() external payable {
        _delegate();
    }

    receive() external payable {
        _delegate();
    }

    function _delegate() internal {
        address impl = implementation;
        assembly {
            // Copy msg.data. We use calldatasize to ensure we get all data.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
