import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Cinzel', serif;
  padding: 0;
  margin: 20px 0;
`;

const NavigationItemComponent = styled.a`
  color: #000;
  text-decoration: none;
  padding: 5px 10px;
`;

const ActiveNavigationItemComponent = styled(NavigationItemComponent)`
  color: #b30201;
`;

export const Links = {
  Home: 'Home',
  About: 'About'
};

export const NavigationItem = ({ active, self, children, onNavigate }) => {
  if (active === self) {
    return (<ActiveNavigationItemComponent onClick={() => onNavigate(self)} href="#">{children}</ActiveNavigationItemComponent>);
  }
  else {
    return (<NavigationItemComponent href="#" onClick={() => onNavigate(self)}>{children}</NavigationItemComponent>);
  }
}

export const Navigation = ({ active, onNavigate }) => (
  <Container>
    <NavigationItem active={active} self={Links.Home} onNavigate={onNavigate}>Home</NavigationItem>
    {" • "}
    <NavigationItem active={active} self={Links.About} onNavigate={onNavigate}>About</NavigationItem>
  </Container>
);
