import { ethers } from 'ethers';

// Contract ABI (simplified for this example)
const contractABI = [
  "function contribute() public payable",
  "function withdraw() public",
  "function getContractDetails() public view returns (uint, uint, uint)"
];

// The address of the deployed contract (update this with your contract address)
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
    goal: details[0].toString(),
    totalFunds: details[1].toString(),
    balance: details[2].toString()
  };
};

// Contribute to the crowdfunding campaign
const contribute = async (amount) => {
  const contract = await getContract();
  const tx = await contract.contribute({
    value: ethers.parseEther(amount)
  });
  await tx.wait(); // wait for transaction confirmation
  return tx;
};

// Withdraw funds (only for the contract owner)
const withdraw = async () => {
  const contract = await getContract();
  const tx = await contract.withdraw();
  await tx.wait(); // wait for transaction confirmation
  return tx;
};

export { getContractDetails, contribute, withdraw };
