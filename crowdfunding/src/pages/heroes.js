import React, { useState, useEffect } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import Nav from './nav';
import CockCool from '../images/cool.png'
import Footer from './footer';
import { getLeaderboard } from '../ethereum';

function Heroes() {
  const [donations, setDonations] = useState([]);

  // Effect to fetch and sort leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const leaderboard = await getLeaderboard();
      const sortedDonations = leaderboard.leaderAddresses.map((address, index) => ({
        address,
        amount: leaderboard.leaderContributions[index],
      }))
      if (leaderboard.leaderAddresses.length > 1) {
        sortedDonations.sort((a, b) => {
          // Convert BigInt to Number safely using `Number()`
          const amountA = Number(a.amount);
          const amountB = Number(b.amount);
          return amountB - amountA;
        });
      }

      setDonations(sortedDonations);
    };

    fetchLeaderboard();
  }, []);


  const getIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Icon name="trophy" color="yellow" />;
      case 2:
        return <Icon name="trophy" color="grey" />;
      case 3:
        return <Icon name="trophy" color="orange" />;
      default:
        return <strong>{rank}</strong>;
    }
  };

  return (
    <Container>
      <Nav />
      <SubContainer>
        <Section>
          <BigHeader>Leaderboard</BigHeader>
          <Table celled sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Rank</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>ETH Donated</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {donations && donations.length > 0 ? (
                donations.map((donation, index) => (
                  <Table.Row key={donation.address}>
                    <Table.Cell>{getIcon(index + 1)}</Table.Cell>
                    <Table.Cell>{donation.address}</Table.Cell>
                    <Table.Cell style={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                      {Number(donation.amount)} wei
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan="3" textAlign="center"><strong>No one has donated yet!</strong></Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Section>
        <ImageContainer>
          <Image src={CockCool} />
        </ImageContainer>
      </SubContainer>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
`;

const SubContainer = styled.div`
  width: auto;
  height: 90vh;
`;

const Section = styled.div`
  textAlign: center;
  padding: 50px;
`;

const BigHeader = styled.div`
    color: var(--black);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 48px;
    font-weight: 700;
    padding-bottom: 30px;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const Image = styled.img`
  width: 30%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;

  @media screen and (max-width: 1178px){
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 20%;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

export default Heroes;
