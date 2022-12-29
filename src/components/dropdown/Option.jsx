import React from 'react';

import { useDropdown } from './DropdownContext';

const Option = (props) => {
  const { onClick } = props;
  const { setShow } = useDropdown();

  const handleClick = () => {
    onClick && onClick();
    setShow(false);
  };

  return (
    <div
      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
};

export default Option;
