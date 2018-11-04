import React, { Component } from 'react';
import styled from 'styled-components';
import background from './assets/bg.jpg';

import { About } from './views/about/About';
import { Home } from './views/home/Home';
import { Loading } from './views/loading/Loading';
import { Results } from './views/results/Results';

import { saveFileService } from './services/SaveFileService';

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

    saveFileService.setProgressListener(this.onProgress);

    this.state = {
      View: Views.Home,
      upload: 'idle',
      choices: [],
    }
  }

  onProgress = (newState) => {
    this.setState({
      upload: newState,
    });
  }

  onNavigateHandler = (target) => {
    this.setState({
      View: Views[target],
    });
  }

  onUploadHandler = async (target) => {
    this.setState({
      View: Loading,
    });
    // Deal with the upload here
    const result = await saveFileService.upload(target.currentTarget.files[0]);
    console.log(result);
    this.setState({
      View: Results,
      choices: result,
    })
  }

  render() {
    const { View, upload, choices } = this.state;

    return (
      <Body>
        <Container>
          <View
            onNavigate={this.onNavigateHandler}
            onUpload={this.onUploadHandler}
            uploadState={upload}
            choices={choices}
          />
        </Container>
      </Body>
    );
  }
}

export default App;
