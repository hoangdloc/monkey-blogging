import React from 'react';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

const TextareaStyles = styled.div`
  position: relative;
  width: 100%;

  textarea {
    width: 100%;
    padding: 16px 20px;
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.grayf1};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s linear;
    color: ${(props) => props.theme.black};
    font-size: 14px;
    resize: none;
    min-height: 200px;
  }

  textarea::-webkit-input-placeholder {
    color: #84878b;
  }

  textarea::-moz-input-placeholder {
    color: #84878b;
  }
`;

/**
 *
 * @param {*} placeholder(optional) - Placeholder of textarea
 * @param {*} name(optional) - name of textarea
 * @param {*} control - control from react hook form
 * @returns Textarea
 */
const Textarea = ({ name = "", type = "text", control, ...props }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });

  return (
    <TextareaStyles>
      <textarea id={name} type={type} {...field} {...props} />
    </TextareaStyles>
  );
};

export default Textarea;
