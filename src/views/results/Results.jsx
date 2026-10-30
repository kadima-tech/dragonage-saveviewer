import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  padding: 0 50px;
  right: 0;
  overflow-y: auto;
  height: 100%;
`;

const ChapterTitle = styled.h2`
  font-family:'Cinzel', serif;
  font-size:20px;
  color:#b30201;
`;

export const Results = ({ choices = [] }) => (
  <Container>
    {
      choices.filter(_choice => _choice.length > 0).map(_choice => (
        <div key={_choice[0].chapter}>
          <ChapterTitle>{_choice[0].chapter}</ChapterTitle>
          {
            _choice.map(({question, choice}) => (
              <div key={question}>
                <b>{question}</b> <br/>
                <span>{choice}</span> <br/><br/>
              </div>
            ))
          }
        </div>
      ))
    }
  </Container>
);
