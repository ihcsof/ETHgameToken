import { ethers } from 'ethers';

// Contract ABI
const contractABI = [
  "function buyTokens() public payable",
  "function claimRefund() public",
  "function getLeaderboard() public view",
  "function getContractDetails() public view returns (uint256, uint256, uint256, uint256, uint256)",
  "function getLeaderboard() external view"
];

// const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractAddress = "0x538a4aE62e41EfFa33E45FF0e2baDcc4bEa3479A"

// Get the Ethereum provider
const getProvider = () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Ethereum provider not found. Please install MetaMask or another Ethereum wallet.");
  }
  // Use BrowserProvider for MetaMask or Ethereum-based wallets
  return new ethers.BrowserProvider(window.ethereum);
};

// Connect to the contract
const getContract = async () => {
  const provider = await getProvider();
  const signer = await provider.getSigner(); // Ensure this is correctly accessed
  return new ethers.Contract(contractAddress, contractABI, signer);
};

// Get contract details (goal, total funds, contract balance)
const getContractDetails = async () => {
  try {
    const contract = await getContract();
    const details = await contract.getContractDetails();

    // Log the raw data to inspect it
    console.log('Contract Details:', details);

    const [tokenPrice, totalRaised, softCap, deadline, minContribution] = details;

    return {
      tokenPrice: ethers.formatUnits(tokenPrice, 18), // Convert tokenPrice to ETH (or adjust decimal places as necessary)
      totalRaised: ethers.formatUnits(totalRaised, 18), // Convert totalRaised to ETH
      softCap: ethers.formatUnits(softCap, 18), // Convert softCap to ETH
      deadline: deadline.toString(), // Ensure deadline is formatted correctly
      minContribution: ethers.formatUnits(minContribution, 18), // Convert minContribution to ETH
    };
  } catch (error) {
    console.error('Error fetching contract details:', error);
    throw error;
  }
};


// Contribute to the crowdfunding campaign
const buyTokens = async (amount) => {
  const contract = await getContract();
  const tx = await contract.buyTokens({
    value: ethers.parseEther(amount)  // Convert string amount to BigNumber
  });
  await tx.wait(); // wait for transaction confirmation
  return tx;
};

// If ICO fails, allow contributors to claim refund
const claimRefund = async () => {
  const contract = await getContract();
  const tx = await contract.claimRefund();  // Assuming this method is correct
  await tx.wait();
  return tx;
};

// Get leaderboard
const getLeaderboard = async () => {
  const contract = await getContract();
  const details = await contract.getLeaderboard();
  return {
    leaderAddresses: details[0],
    leaderContributions: details[1],
  };
};

export { getContractDetails, buyTokens, claimRefund, getLeaderboard };
