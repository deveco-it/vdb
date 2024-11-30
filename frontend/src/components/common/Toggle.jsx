import React from 'react';
import { Switch } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import ToggleOn from '@icons/toggle-on.svg?react';
import ToggleOff from '@icons/toggle-off.svg?react';

const Toggle = ({ isOn, handleClick, size = 'md', disabled, children, variant = 'primary' }) => {
  const customSize = {
    sm: 22,
    md: 26,
    lg: 30,
  };

  const style = {
    primary: {
      disabled: 'text-midGray dark:text-midGrayDark',
    },
    secondary: {
      main: 'text-white dark:text-whiteDark',
      disabled: 'text-lightGray dark:text-lightGrayDark',
    },
  };

  return (
    <Switch checked={isOn} onChange={() => !disabled && handleClick()} disabled={disabled}>
      {({ checked, disabled }) => (
        <div
          className={twMerge(
            'flex items-center gap-2',
            disabled || !checked ? style[variant].disabled : style[variant].main,
          )}
        >
          <div>
            {checked ? (
              <ToggleOn width={customSize[size]} height={customSize[size]} viewBox="0 0 16 16" />
            ) : (
              <ToggleOff width={customSize[size]} height={customSize[size]} viewBox="0 0 16 16" />
            )}
          </div>
          {children && <div className="flex items-center">{children}</div>}
        </div>
      )}
    </Switch>
  );
};

export default Toggle;
