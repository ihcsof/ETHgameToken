import React, { useState, useEffect } from 'react';
import Nav from './nav';
import styled from 'styled-components';
import { Button, Form, Input, Segment, Header } from 'semantic-ui-react';
import { getContractDetails, contribute, withdraw } from '../ethereum'; // Import the Ethereum functions

function Funding() {
  const [account, setAccount] = useState('');
  const [goal, setGoal] = useState(0);
  const [totalFunds, setTotalFunds] = useState(0);
  const [balance, setBalance] = useState(0);
  const [contributionAmount, setContributionAmount] = useState('');

  // Fetch contract details on component mount or account change
  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const { goal, totalFunds, balance } = await getContractDetails();
        setGoal(goal);
        setTotalFunds(totalFunds);
        setBalance(balance);
      } catch (error) {
        console.error("Error fetching contract details:", error);
      }
    };

    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => setAccount(accounts[0]))
        .catch(error => console.error(error));
    }

    if (account) {
      fetchContractDetails();
    }
  }, [account]); // Re-fetch contract details when the account changes

  // Handle contribution
  const handleContribution = async (event) => {
    event.preventDefault();
    try {
      await contribute(contributionAmount);
      alert("Contribution successful!");
      setContributionAmount(''); // Clear the input
      // Optionally re-fetch contract details after contribution
      const { goal, totalFunds, balance } = await getContractDetails();
      setGoal(goal);
      setTotalFunds(totalFunds);
      setBalance(balance);
    } catch (error) {
      alert("Contribution failed.");
      console.error(error);
    }
  };

  // Handle withdrawal (only for owner)
  const handleWithdraw = async () => {
    try {
      await withdraw();
      alert("Funds withdrawn successfully.");
      // Optionally re-fetch contract details after withdrawal
      const { goal, totalFunds, balance } = await getContractDetails();
      setGoal(goal);
      setTotalFunds(totalFunds);
      setBalance(balance);
    } catch (error) {
      alert("Withdrawal failed.");
      console.error(error);
    }
  };

  return (
    <Container>
      <Nav />
      <Segment>
        <Header as="h2">Crowdfunding Campaign</Header>
        <p>Goal: {goal} ETH</p>
        <p>Total Funds Collected: {totalFunds} ETH</p>
        <p>Contract Balance: {balance} ETH</p>
      </Segment>

      <Segment>
        <Form onSubmit={handleContribution}>
          <Form.Field>
            <label>Contribution Amount (ETH)</label>
            <Input
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              type="number"
              placeholder="Enter amount in ETH"
            />
          </Form.Field>
          <Button primary type="submit">Contribute</Button>
        </Form>
      </Segment>

      <Segment>
        <Button color="green" onClick={handleWithdraw}>Withdraw Funds</Button>
      </Segment>
    </Container>
  )
}

const Container = styled.div`
`;

export default Funding;