import { ethers } from 'ethers';

const contractABI = [
  "function buyTokens() public payable",
  "function claimRefund() public",
  "function getLeaderboard() public view",
  "function getContractDetails() public view returns (uint256, uint256, uint256, uint256, uint256)",
  "function getLeaderboard() external view"
];

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// Get the Ethereum provider
const getProvider = () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Ethereum provider not found. Please install MetaMask or another Ethereum wallet.");
  }
  return new ethers.BrowserProvider(window.ethereum);
};

// Connect to the contract
const getContract = async () => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

const getContractDetails = async () => {
  try {
    const contract = await getContract();
    const [tokenPrice, totalRaised, softCap, deadline, minContribution] = await contract.getContractDetails();

    return {
      // Convert numbers to ETH
      tokenPrice: ethers.formatUnits(tokenPrice, 18),
      totalRaised: ethers.formatUnits(totalRaised, 18),
      softCap: ethers.formatUnits(softCap, 18),
      deadline: deadline.toString(),
      minContribution: ethers.formatUnits(minContribution, 18),
    };
  } catch (error) {
    console.error('Error fetching contract details:', error);
    throw error;
  }
};

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
  const tx = await contract.claimRefund();
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
