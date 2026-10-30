import { useEffect, useState } from 'react';
import styled from 'styled-components';
import background from './assets/bg.jpg';

import { About } from './views/about/About';
import { Home } from './views/home/Home';
import { Loading } from './views/loading/Loading';
import { Results } from './views/results/Results';

import { saveFileService } from './services/SaveFileService';

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
  max-width: 100%;
  height: 100%;
`;

const Views = {
  Home,
  Loading,
  Results,
  About,
};

const App = () => {
  const [view, setView] = useState('Home');
  const [upload, setUpload] = useState('idle');
  const [choices, setChoices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    saveFileService.setProgressListener(setUpload);
  }, []);

  const onUpload = async (file) => {
    if (!file) {
      return;
    }

    setError(null);
    setView('Loading');
    try {
      setChoices(await saveFileService.upload(file));
      setView('Results');
    } catch (e) {
      console.error(e);
      setError(e.message);
      setView('Home');
    }
  };

  const View = Views[view];

  return (
    <Body>
      <Container>
        <View
          onNavigate={setView}
          onUpload={onUpload}
          uploadState={upload}
          choices={choices}
          error={error}
        />
      </Container>
    </Body>
  );
};

export default App;
