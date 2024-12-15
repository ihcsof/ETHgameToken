import React from 'react';
import styled from 'styled-components';
import Nav from './nav';
import Body from './body';
import Footer from './footer';

function Home() {
  return (
    <Container>
      <Nav />
      <Body />
      <Footer />
    </Container>);
}

const Container = styled.div`
`;

export default Home;