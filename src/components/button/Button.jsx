import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { LoadingSpinner } from '../loading';

const ButtonStyles = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0 25px;
  line-height: 1;
  ${(props) =>
    props.kind === "secondary" &&
    css`
      background-color: white;
      color: ${(props) => props.theme.primary};
    `};
  ${(props) =>
    props.kind === "primary" &&
    css`
      color: white;
      background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
      );
    `};
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  height: ${(props) => props.height || "66px"};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * @param {boolean} isLoading Loading state of button
 * @param {*} onClick Handle click function of button
 * @param {Node} children React node
 * @requires
 * @param {string} type Type of button 'button' | 'submit'
 * @param {string} kind Button color 'primary' | 'secondary'
 */
const Button = ({
  type = "button",
  kind = "primary",
  children,
  onClick = () => {},
  ...props
}) => {
  const { isLoading, to } = props;
  const child = !!isLoading ? <LoadingSpinner /> : children;

  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to} style={{ display: "inline-block" }}>
        <ButtonStyles kind={kind} type={type} {...props}>
          {child}
        </ButtonStyles>
      </NavLink>
    );
  }

  return (
    <ButtonStyles type={type} kind={kind} onClick={onClick} {...props}>
      {child}
    </ButtonStyles>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  kind: PropTypes.oneOf(["primary", "secondary"]),
};

export default Button;
