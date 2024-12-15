import React, { useState, useEffect } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import Nav from './nav';
import CockCool from '../images/cool.png'
import Footer from './footer';
import { getLeaderboard } from '../ethereum';

// Sample donation data (replace with actual data)
const mockDonations = [
  { address: '0x12345552839398213', amount: 5.2 },
  { address: '0x45612345552839398', amount: 3.1 },
  { address: '0x78945612345552839', amount: 7.8 },
  { address: '0xabc45612345552839', amount: 2.5 },
  { address: '0xdef45612345552839', amount: 4.0 },
];

function Heroes() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const sortedDonations = [...mockDonations].sort((a, b) => b.amount - a.amount);
    setDonations(sortedDonations);
  }, []);

  // Effect to fetch and sort leaderboard data
  // useEffect(() => {
  //   const fetchLeaderboard = async () => {
  //     const leaderboard = await getLeaderboard();
  //     const sortedDonations = leaderboard.leaderAddresses.map((address, index) => ({
  //       address,
  //       amount: leaderboard.leaderContributions[index],
  //     })).sort((a, b) => b.amount - a.amount); // Sort by contributions in descending order

  //     setDonations(sortedDonations);
  //   };

  //   fetchLeaderboard();
  // }, []);


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
              {donations.map((donation, index) => (
                <Table.Row key={donation.address}>
                  <Table.Cell>{getIcon(index + 1)}</Table.Cell>
                  <Table.Cell>{donation.address}</Table.Cell>
                  <Table.Cell style={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>{donation.amount} ETH</Table.Cell>
                </Table.Row>
              ))}
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
