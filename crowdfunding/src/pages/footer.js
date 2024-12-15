import React from 'react';
import styled from 'styled-components';
// import UnigeLogo from '../svgs/UnigeLogo.svg';
// import DIBRIS from '../svgs/UnigeDIBRIS.svg';
// import CONNECT from '../svgs/UnigeConnect.svg';

function Footer() {
  return (
      <Container>
        <Flex>
          {/* <Image src={UnigeLogo} />
          <Image src={DIBRIS} />
          <Image src={CONNECT} /> */}
        </Flex>
        <Flex>
          <FlexColumn>
            <Text>Università degli Studi di Genova</Text>
            <Text>Via Balbi 5, 16126 Genova</Text>
          </FlexColumn>
          <FlexColumn>
            <Text>tel +39 01020991</Text>
            <Text>fax +39 0102099227</Text>
          </FlexColumn>
          <FlexColumn>
            <Text>protocollo@</Text>
            <Text>pec.unige.it</Text>
          </FlexColumn>
          <FlexColumn>
            <Text>Partita IVA</Text>
            <Text>00754150100</Text>
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
  background-color: var(--blue);
  padding: 5vh 15vw;
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
  flex-direction: column;
  gap: 20px;
`;
const Text = styled.div`
  color: white; 
  font-family: "Fira Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 200;
`;

const Image = styled.img`
`;

export default Footer;