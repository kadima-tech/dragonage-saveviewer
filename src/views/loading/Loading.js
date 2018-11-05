// <div>
//   <div class="text">
//   <h2>{{stateText}}</h2>
//   </div>
// </div>

import React from 'react';
import styled from 'styled-components';

const getText = uploadState => {
  switch(uploadState) {
    case 'parsing':
      return "Story extraction is in progress. This process may take a few minutes...";
    case 'processing':
      return "Data extracted. Generating choices...";
    default:
      return "Idle...";
  }
}
// h1, h2{font-family:'Cinzel', serif;}
// h2{font-size:20px;color:#b30201;}
const Container = styled.div`
  padding: 0 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
  width: 575px;
`;

const StatusBox = styled.h2`
  font-family:'Cinzel', serif;
  font-size:20px;
  color:#b30201;
`;

export const Loading = ({ uploadState }) => (
  <Container>
    <StatusBox>
      {getText(uploadState)}
    </StatusBox>
  </Container>
);
