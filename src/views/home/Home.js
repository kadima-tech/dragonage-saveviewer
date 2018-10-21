import React from 'react';
import styled from 'styled-components';
import { UploadBox } from '../../components/upload-box/UploadBox.js';
import { Navigation, Links } from '../../components/navigation/Navigation';

const Container = styled.div`
  padding: 0 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
  width: 575px;
  height: 100%;
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

export const Home = ({ onNavigate, onUpload }) => (
  <Container>
    <Title>Dragon Age <Accent>Save Game Tool</Accent></Title>
    <Subtitle>Use your old save-file with Dragon Age: Inquisition</Subtitle>
    <p>
      Upload your Dragon Age: Origins save game in the box below and this website will list out the choices you made in the game.
      You can use these to enter your story into the Dragon Age Keep and retain your story without having to remember every
      minor choice you made.
    </p>
    <UploadBox />
    <Navigation active={Links.Home} onNavigate={onNavigate} />
  </Container>
);
