import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  padding: 0 50px;
  right: 0;
  overflow-y: scroll;
  height: 100%;
`;

const ChapterTitle = styled.h2`
  font-family:'Cinzel', serif;
  font-size:20px;
  color:#b30201;
`;

export const Results = ({ chapters }) => (
  <Container>
    {
      chapters.map(chapter => (
        <div>
          <ChapterTitle>{chapter[0].chapter}</ChapterTitle>
          {
            chapter.map(({question, choice}) => (
              <div>
                <b>{question}</b> <br/>
                <span>{choice}</span>
              </div>
            ))
          }
        </div>
      ))
    }
  </Container>
);

Results.defaultProps = {
  chapters: [],
}
