import React from 'react';
import styled from 'styled-components';
import { Navigation, Links } from '../../components/navigation/Navigation';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  padding: 0 50px;
  right: 0;
  overflow-y: scroll;
  height: 100%;
`;

const Title = styled.h2`
  font-family:'Cinzel', serif;
  font-size: 20px;
  color: #b30201;
`;

const CreditsTitle = styled.h4`
  margin-bottom: 0;
`;

export const About = ({ onNavigate }) => (
  <Container>
    <Title>About the tool</Title>
    <p>
      This website was created by me, Jacobus Meulen, as a response to Bioware's choice to restrict savegame imports in Dragon Age Inquisition to the Dragon Age Keep, with no option to import the actual save files and choices that the players made in the previous games into Dragon Age Keep. Please note that only the latest versions of Google Chrome, Safari and Firefox are currently supported. Internet Explorer is NOT supported and will not work until they update their Javascript processing capabilities.
    </p>
    <p>
      On this website you will find the option to upload both Dragon Age: Origins save games (.das) and, in the near future, Dragon Age 2 save games (.das). Please note that support is currently restricted to PC versions of the game, and that Xbox 360 or Playstation 3 save files will NOT work. The website will automatically figure out what game the specified savegame belongs to and extract the story choices from the save file. The server will then convert the resulting GUIDs and Flags into human-readable questions and answers that define the choices the player made in their save game.
    </p>
    <p>
      This is achieved by use of jsGFF, a Javascript port of a tool released in 2011 by William Clark called pyGFF. This javascript library is more restricted than it's python counter part, in that it only does reading of information, not writing, and it doesn't create special types for the different forms of information. However, it should be noted that it would not have been possible for me to create jsGFF without William Clarks early efforts.
    </p>
    <p>
      On the server, the information is mapped to a large document containing all the possible choices the player may have made. This process is still in beta stages, but will work for most save games. The information on the server is based on the work of Charles Noneman, who created a python program that reads your Dragon Age Origins choices. Because this involved a lot of manual work, both on my and on Charles Noneman's part, it is very much possible that several errors are still present. For instance, you may see that your choices are listed as "Invalid", or in some rare cases, being listed as a different choice than the one you actually made. In such a case, please use the "Notify Error" utility that is listed next to each choice, and select the choice that you actually made. This will notify me of the problem, after which I can evaluate and fix it. The more people use this website, the more accurate the output will be, and until Bioware provides me with a document containing all the possible choices the player could make and the flags that specify them, this is the best option we have.
    </p>
    <p>
      The front-end for this website was created by Alexander van Bergen, under the label of his company "StinStin". Any graphics found on the website are copyrighted to him. The Javascript code found on this website is free for anyone else to use non-commercially. If you find any bugs, please notify me by clicking the "Bug Issue" button on the navigation bar.
    </p>
    <p>
      <h3>Full credits</h3>
      <CreditsTitle>Website Design</CreditsTitle>
      Alexander van Bergen (StinStin)

      <CreditsTitle>jsGFF and Website back-end</CreditsTitle>
      Jacobus Meulen

      <CreditsTitle>pyGFF</CreditsTitle>
      William Clark

      <CreditsTitle>DASaveReader</CreditsTitle>
      Charles Noneman
    </p>
    <Navigation active={Links.About} onNavigate={onNavigate} />
  </Container>
)
