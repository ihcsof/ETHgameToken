import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Header, Table } from 'semantic-ui-react';
import { getContractDetails, buyTokens, claimRefund } from '../ethereum'; // Import the Ethereum functions
import Nav from './nav';
import Footer from './footer';

function Funding() {
  const [account, setAccount] = useState('');
  const [goal, setGoal] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [totalFunds, setTotalFunds] = useState(0);
  const [contributionAmount, setContributionAmount] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [minContribution, setMinContribution] = useState(0);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const { tokenPrice, totalRaised, softCap, deadline, minContribution } = await getContractDetails();

        setGoal(softCap); // Set the goal to softCap
        setTotalFunds(totalRaised); // Set the total funds collected
        setDeadline(deadline); // Set the deadline
        setTokenPrice(tokenPrice); // Set the token price
        setMinContribution(minContribution); // Set the minimum contribution amount
      } catch (error) {
        alert('Error fetching contract details: \n' + error);
      }
    };

    // Request the user's Ethereum account
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => setAccount(accounts[0]))
        .catch(error => console.error(error));
    }

    // Fetch contract details once the account is available
    if (account) {
      fetchContractDetails();
    }
  }, [account]); // Re-fetch contract details when the account changes

  // Handle contribution
  const handleContribution = async (event) => {
    event.preventDefault();
    try {
      await buyTokens(contributionAmount); // Send contribution to buy tokens
      alert('Contribution successful!');
      setContributionAmount(''); // Clear the input field

      // Fetch contract details from Ethereum
      const { tokenPrice, totalRaised, softCap, deadline, minContribution } = await getContractDetails();

      // Re-fetch for updates
      setGoal(softCap); // Set the goal to softCap, assuming it's the goal
      setTotalFunds(totalRaised); // Set the total funds collected
      setDeadline(deadline); // Set the deadline
      setTokenPrice(tokenPrice); // Set the token price
      setMinContribution(minContribution); // Set the minimum contribution amount
    } catch (error) {
      if (error.reason)
        alert('Contribution failed, contract says: \n' + error.reason);
      else
        alert('Contribution failed: \n' + error);
    }
  };

  const handleRefund = async (event) => {
    event.preventDefault();
    try {
      await claimRefund(refundAmount);
      alert('Refund successful!');
      setContributionAmount('');

      const { tokenPrice, totalRaised, softCap, deadline, minContribution } = await getContractDetails();

      // Re-fetch for updates
      setGoal(softCap); // Set the goal to softCap, assuming it's the goal
      setTotalFunds(totalRaised); // Set the total funds collected
      setDeadline(deadline); // Set the deadline
      setTokenPrice(tokenPrice); // Set the token price
      setMinContribution(minContribution); // Set the minimum contribution amount
    } catch (error) {
      if (error.reason)
        alert('Refund failed, contract says: \n' + error.reason);
      else
        alert('Refund failed: \n' + error);
    }
  };

  return (
    <Container>
      <Nav />
      <SubContainer>
        <Section>
          <BigHeader>Funding Campaign</BigHeader>
          <TableSection>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Parameter</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>Goal</Table.Cell>
                  <Table.Cell>{goal} ETH</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Total Funds Collected</Table.Cell>
                  <Table.Cell>{totalFunds} ETH</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Deadline</Table.Cell>
                  <Table.Cell>{new Date(deadline * 1000).toLocaleString()}</Table.Cell> {/* Format deadline as a date */}
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Token price</Table.Cell>
                  <Table.Cell>{tokenPrice} ETH</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Minimum Contribution</Table.Cell>
                  <Table.Cell>{minContribution} ETH</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </TableSection>
        </Section>
      </SubContainer>
      <SubHeader>Make the difference!</SubHeader>
      <CardContainer>
        <StyledCard>
          <Header as="h3" textAlign="center">Contribution</Header>
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
            <StyledButton type="submit" color="green">Buy tokens</StyledButton>
          </Form>
        </StyledCard>

        <StyledCard>
          <Header as="h3" textAlign="center">Refund</Header>
          <Form onSubmit={handleRefund}>
            <Form.Field>
              <label>Refund Amount (ETH)</label>
              <Input
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                type="number"
                placeholder="Enter amount in ETH"
              />
            </Form.Field>
            <StyledButton type="submit" color="red">Refund</StyledButton>
          </Form>
        </StyledCard>
      </CardContainer>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
`;

const SubContainer = styled.div`
  width: auto;
  height: 50vh;
`;

const Section = styled.div`
  text-align: center;
  padding: 50px;
`;

const TableSection = styled.div`
  margin-left: 30vw;
  margin-right: 30vw;
  padding-top: 50px;
`;

const BigHeader = styled.div`
  color: var(--black);
  text-align: center;
  font-family: 'Roboto Slab';
  font-size: 48px;
  font-weight: 700;
  padding-bottom: 30px;
`;

const SubHeader = styled.div`
    color: var(--black);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 42px;
    font-weight: 500;
    line-height: normal;
    padding-top: 50px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  padding: 50px;
  gap: 50px;
`;

const StyledCard = styled.div`
  width: 350px; 
  padding: 20px; 
  border: 1px solid rgb(122, 122, 122);
  border-radius: 10px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

export default Funding;
