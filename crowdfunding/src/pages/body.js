import React from 'react';
import styled from 'styled-components';
import CockBanner from '../images/banner.png'
import CockLeft from '../images/left.png';
import CockRight from '../images/right.png';

function Body() {
  const handleRedirection = (address) => {
    window.location.href = '/' + address;
  };
  return (
    <Container>
      <HeaderContainer>
        <BigHeader>
          Cock Fight Simulator
        </BigHeader>
        <SubHeader>
          ETH Crowdfunding
        </SubHeader>
      </HeaderContainer>
      <ImageContainer>
        <HeadingImage src={CockBanner} />
      </ImageContainer>
      <MidHeader>
        What is this all about?
      </MidHeader>
      <SubContainer>
        <LeftSection>
          <Header>
            Hit that cock!
          </Header>
          <Text>
            We are a group of students behind the <strong>Cock Fight Simulator game</strong>.
            We want to fund our videogame idea to improve the quality!
          </Text>
          <Text>
            Buy our tokens to help us!
          </Text>
          <CustomButton onClick={() => handleRedirection('funding')}>FUND NOW</CustomButton>
        </LeftSection>
        <RightSection src={CockRight} onClick={() => handleRedirection('game')}/>
        <RightSection src={CockLeft} onClick={() => handleRedirection('game')}/>
        <LeftSection>
          <Header>
            Assignment
          </Header>
          <Text>
            This website has been developed as an assignment of the <strong>Decentralized System</strong> master course.
          </Text>
          <Text>
            a.y. 2024/25
          </Text>
        </LeftSection>
      </SubContainer>
    </Container>
  );
}

const Container = styled.div`
`;

const SubContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); 
    gap: 5vw;
    padding: 50px 15vw;
    align-content: center;
    width: 100vw;
    min-height: 90vh;

    @media screen and (max-width: 566px){
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
    }
    @media screen and (max-width: 480px){
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    }
    @media screen and (max-width: 375px){
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    }
`;

const HeaderContainer = styled.div`
  padding: 30px;
`;

const BigHeader = styled.div`
    color: var(--black);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 52px;
    font-weight: 700;
    line-height: normal;
`;

const SubHeader = styled.div`
    color: var(--black);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 42px;
    font-weight: 500;
    line-height: normal;
`;

const MidHeader = styled.div`
    color: var(--black);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const HeadingImage = styled.img`
  width: auto;
  height: 600px;
`;

const LeftSection = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 20px;

  @media screen and (max-width: 1178px){
    padding: 10vh 10vw;
  }
`;

const RightSection = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;

  @media screen and (max-width: 1178px){
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const Header = styled.div`  
    color: var(--blue);
    text-align: left;
    font-family: "Roboto Slab";
    font-weight: 700;
    font-size: 42px;
    line-height: 52px;

    @media screen and (max-width: 736px){
        font-size: 32px;
  }
`;

const Text = styled.div`
    color: var(--black);
    font-family: "Fira Sans";
    font-size: 24px;
    line-height: 32px;
`;

const CustomButton = styled.button`
    background: var(--black);
    color: white;
    width: 225px;
    min-height: 50px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    padding: 0 1.5em;

    &:hover {
        opacity: 0.9;
    }

    @media screen and (max-width: 1178px){
      width: 100%;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 70vh;
`;

export default Body;