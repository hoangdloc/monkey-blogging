import React, { Fragment, useState } from 'react';

import { IconEyeClose, IconEyeOpen } from '../icon';
import Input from './Input';

const InputPasswordToggle = ({ control }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  if (!control) return null;

  return (
    <Fragment>
      <Input
        type={togglePassword ? "text" : "password"}
        name="password"
        placeholder="Enter your password"
        control={control}
      >
        {!togglePassword ? (
          <IconEyeClose onClick={() => setTogglePassword(true)} />
        ) : (
          <IconEyeOpen onClick={() => setTogglePassword(false)} />
        )}
      </Input>
    </Fragment>
  );
};

export default InputPasswordToggle;
