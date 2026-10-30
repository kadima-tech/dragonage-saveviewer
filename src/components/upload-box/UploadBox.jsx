import { useRef, useState } from 'react';
import styled from 'styled-components';

const DropBox = styled.div`
  background: #FFF;
  border-radius: 5px 0 0 5px;
  padding: 15px 20px;
  margin-top: 25px;
  text-align: left;
  box-shadow: inset 0 0 3px 1px #aaa;
  position: relative;
  border: 1px solid ${({ $hover }) => ($hover ? '#b30201' : '#aaa')};
  display: inline-block;
  max-width: 400px;
  width: 100%;
`;

const InnerButton = styled.label`
  float: right;
  background: linear-gradient(#b30201, #790101);
  border: 3px solid #b30201;
  color: #FFF;
  padding: 5px 10px;
  border-radius: 3px;
  position: absolute;
  right: 7px;
  top: 7px;
  overflow: hidden;
  font-size: 16px;
  cursor: pointer;
`;

const OuterButton = styled.button`
  display: inline-block;
  padding: 15px 20px;
  border-radius: 0 5px 5px 0;
  border: 1px solid #111;
  border-left: 0;
  background: linear-gradient(#333, #111);
  color: #FFF;
  font-size: 16px;
  cursor: pointer;
`;

const InputField = styled.input`
  width: 1px;
  height: 1px;
  opacity: 0;
  position: absolute;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
`;

const Placeholder = styled.span`
  color: #AAA;
  font-size: 16px;
`;

export const UploadBox = ({ onUpload }) => {
  const input = useRef(null);
  const [hover, setHover] = useState(false);

  const onDrop = (event) => {
    event.preventDefault();
    setHover(false);
    onUpload(event.dataTransfer.files[0]);
  };

  return (
    <div>
      <DropBox
        $hover={hover}
        onDragOver={(event) => {
          event.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={onDrop}
      >
        <InnerButton htmlFor="save-file-input">
          <span>Browse</span>
          <InputField
            ref={input}
            id="save-file-input"
            type="file"
            accept=".das"
            onChange={(event) => onUpload(event.currentTarget.files[0])}
          />
        </InnerButton>
        <Placeholder>
          Browse or drag file...
        </Placeholder>
      </DropBox>
      <OuterButton type="button" onClick={() => input.current.click()}>Upload</OuterButton>
    </div>
  );
};
