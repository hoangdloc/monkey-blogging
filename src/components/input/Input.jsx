import PropTypes from 'prop-types';
import React from 'react';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

const InputStyles = styled.div`
  position: relative;
  width: 100%;

  input {
    width: 100%;
    padding: ${(props) =>
      props.hasIcon ? "16px 60px 16px 20px" : "16px 20px"};
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.grayf1};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s linear;
    color: ${(props) => props.theme.black};
    font-size: 14px;
  }

  input::-webkit-input-placeholder {
    color: #84878b;
  }

  input::-moz-input-placeholder {
    color: #84878b;
  }

  .input-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

/**
 *
 * @param {*} placeholder(optional) - Placeholder of input
 * @param {*} name(optional) - name of input
 * @param {*} control - control from react hook form
 * @returns Input
 */
const Input = ({ name = "", type = "text", children, control, ...props }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });

  return (
    <InputStyles hasIcon={children ? true : false}>
      <input id={name} type={type} {...field} {...props} />
      {children ? <div className="input-icon">{children}</div> : null}
    </InputStyles>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  children: PropTypes.node,
  control: PropTypes.any.isRequired,
};

export default Input;
