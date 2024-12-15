import React from 'react';
import styled from 'styled-components';
import SteamLogo from '../images/steam.png';
import KickStarterLogo from '../images/kickstarter.png';

function Footer() {
    return (
        <Container>
            <Flex>
                <FlexColumn>
                    <a href='https://store.steampowered.com/app/3330460/Cock_Fight_Simulator/'><Image src={SteamLogo} /></a>
                    <Text>Find us on Steam!</Text>
                </FlexColumn>
                <FlexColumn>
                    <a href='https://www.kickstarter.com/projects/cockfightsimulator/cock-fight-simulator'><Image src={KickStarterLogo} /></a>
                    <Text>Join us on KickStarter!</Text>
                </FlexColumn>
            </Flex>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 50px;
  min-height: 40vh;
  background-color: var(--black);
  padding: 5vh 15vw;
`;

const BigHeader = styled.div`
    color: var(--light-blue);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  flex-wrap: wrap;
`;

const FlexColumn = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const Text = styled.div`
  color: white; 
  font-family: "Fira Sans";
  font-size: 24px;
  font-style: bold;
`;

const Image = styled.img`
    width: 100px;
    height: 100px;
`;

export default Footer;