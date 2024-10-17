import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  disabled,
  id,
  name,
  onClick,
  title,
  value,
  type = 'button',
  tabIndex,
  className = '',
  variant = 'primary',
  borderStyle = 'border',
  roundedStyle = 'rounded',
  noPadding,
  noOutline,
}) => {
  const outlineStyle = `focus:outline ${
    noOutline
      ? 'outline-0'
      : 'outline-1 outline-bgCheckboxSelected dark:outline-bgCheckboxSelectedDark'
  }`;

  const paddingStyle = noPadding ? '' : 'px-3 py-1.5';

  const customStyle = {
    primary:
      'text-fgThird dark:text-fgThirdDark bg-bgButton dark:bg-bgButtonDark border-borderSecondary dark:border-borderSecondaryDark disabled:opacity-40 disabled:text-fgPrimary dark:disabled:text-fgPrimaryDark hover:bg-borderPrimary dark:hover:bg-borderPrimaryDark hover:border-borderPrimary dark:hover:border-borderPrimaryDark',
    secondary:
      'text-fgThird dark:text-fgThirdDark bg-bgButtonSecondary dark:bg-bgButtonSecondaryDark border-borderThird dark:border-borderThirdDark hover:border-borderPrimary dark:hover:border-borderPrimaryDark hover:bg-borderPrimary dark:hover:bg-borderPrimaryDark',
    third:
      'border-fgThird dark:border-lightGrayDark bg-borderSecondary dark:bg-borderPrimaryDark text-black dark:text-fgPrimaryDark',
    fourth:
      'border-borderPrimary dark:border-borderPrimaryDark bg-borderPrimary dark:bg-borderPrimaryDark text-black dark:text-fgPrimaryDark',
    'outline-primary': 'border-borderSecondary dark:border-borderSecondaryDark',
    danger:
      'bg-bgError dark:bg-bgErrorDark hover:border-bgErrorSecondary hover:dark:border-bgErrorSecondaryDark hover:bg-bgErrorSecondary dark:hover:bg-bgErrorSecondaryDark text-white dark:text-whiteDark border-bgError dark:border-bgErrorDark',
    success: 'bg-bgSuccess dark:bg-bgSuccessDark border-bgSuccess dark:border-borderSuccessDark',
  };

  return (
    <button
      className={twMerge(
        'flex items-center justify-center font-normal',
        roundedStyle,
        outlineStyle,
        borderStyle,
        customStyle[variant],
        paddingStyle,
        className,
      )}
      onClick={onClick}
      title={title}
      disabled={disabled}
      id={id}
      name={name}
      value={value}
      tabIndex={tabIndex}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
