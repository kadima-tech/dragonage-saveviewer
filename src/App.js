import React, { Component } from 'react';
import styled from 'styled-components';
import background from './assets/bg.jpg';

import { About } from './views/about/About';
import { Home } from './views/home/Home';
import { Loading } from './views/loading/Loading';
import { Results } from './views/results/Results';

import logo from './logo.svg';
import './App.css';

const Body = styled.div`
  background: url(${background}) no-repeat right bottom fixed;
  font-size: 16px;
  font-family: 'PT Sans', sans-serif;
  height: 100vh;
`;

const Container = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
  width: 675px;
  height: 100%;
`;

const Views = {
  Home,
  Loading,
  Results,
  About,
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      View: Views.Home
    }
  }

  onNavigateHandler = (target) => {
    this.setState({
      View: Views[target]
    });
  }

  onUploadHandler = (target) => {
    // Deal with the upload here
  }

  render() {
    const { View } = this.state;

    return (
      <Body>
        <Container>
          <View onNavigate={this.onNavigateHandler} onUpload={this.onUploadHandler}/>
        </Container>
      </Body>
    );
  }
}

export default App;
