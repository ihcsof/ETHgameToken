import { ethers } from 'ethers';

// Contract ABI
const contractABI = [
  "function buyTokens() public payable",
  "function claimRefund() public",
  "function getLeaderboard() public view",
  "function getContractDetails() public view",
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
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

// Get contract details (goal, total funds, contract balance)
const getContractDetails = async () => {
  const contract = await getContract();
  const details = await contract.getContractDetails();
  return {
    tokenPrice: details[0].toString(),
    totalRaised: details[1].toString(),
    softCap: details[2].toString(),
    deadline: details[3].toString(),
    minContribution: details[4].toString(),
    isFinalized: details[5].toString(),
  };
};

// Contribute to the crowdfunding campaign
const buyTokens = async (amount) => {
  const contract = await getContract();
  const tx = await contract.buyTokens({
    value: ethers.parseEther(amount)
  });
  await tx.wait(); // wait for transaction confirmation
  return tx;
};

// If ICO fails, allow contributors to claim refund
const claimRefund = async () => {
  const contract = await getContract();
  const tx = await contract.withdraw();
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
