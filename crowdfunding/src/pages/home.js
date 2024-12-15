import React from 'react';
import styled from 'styled-components';
import Nav from './nav';
import Footer from './footer';

function Home() {
  return (
  <Container>
    <Nav />
    Ciaoooo
    <Footer />
  </Container>);
}

const Container = styled.div`
`;

export default Home;