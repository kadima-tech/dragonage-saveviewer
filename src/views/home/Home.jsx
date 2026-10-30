import styled from 'styled-components';
import { UploadBox } from '../../components/upload-box/UploadBox';
import { Navigation } from '../../components/navigation/Navigation';
import { Links } from '../../components/navigation/links';

const Container = styled.div`
  padding: 0 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
  width: 575px;
  max-width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-family:'Cinzel', serif;
  font-size: 28px;
`;

const Subtitle = styled.h2`
  font-family:'Cinzel', serif;
  font-size: 20px;
  color: #b30201;
`;

const Accent = styled.span`
  color:#b30201;
`;

const ErrorMessage = styled.p`
  color: #b30201;
  font-weight: bold;
`;

export const Home = ({ onNavigate, onUpload, error }) => (
  <Container>
    <Title>Dragon Age <Accent>Save Game Tool</Accent></Title>
    <Subtitle>Use your old save-file with Dragon Age: Inquisition</Subtitle>
    <p>
      Upload your Dragon Age: Origins save game in the box below and this website will list out the choices you made in the game.
      You can use these to enter your story into the Dragon Age Keep and retain your story without having to remember every
      minor choice you made.
    </p>
    <UploadBox onUpload={onUpload} />
    {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    <Navigation active={Links.Home} onNavigate={onNavigate} />
  </Container>
);
