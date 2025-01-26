import React from 'react';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import ReactSelectCreatable from 'react-select/creatable';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/context';

const Select = ({
  autoFocus = false,
  borderStyle = 'border',
  className,
  defaultMenuIsOpen = false,
  filterOption,
  isClearable = false,
  isDisabled = false,
  isSearchable,
  minMenuHeight,
  maxMenuHeight,
  menuHeight,
  menuPlacement = 'auto',
  menuShouldScrollIntoView = true,
  name,
  noBorder,
  noDropdown,
  onChange,
  options,
  placeholder,
  roundedStyle = 'rounded-sm',
  value,
  variant = 'select',
  ref,

  // Async
  cacheOptions,
  getOptionLabel,
  loadOptions,

  // Creatable
  isMulti,
  noOptionsMessage,
  noRemove,
}) => {
  const { isMobile, isDesktop, isWide } = useApp();
  const defaultMaxWidth = isWide ? 500 : isDesktop ? 450 : isMobile ? 350 : 400;

  let Component;
  switch (variant) {
    case 'select':
      Component = ReactSelect;
      break;
    case 'async':
      Component = AsyncSelect;
      break;
    case 'creatable':
      Component = ReactSelectCreatable;
      break;
  }

  return (
    <Component
      autoFocus={autoFocus}
      defaultMenuIsOpen={defaultMenuIsOpen}
      filterOption={filterOption}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      minMenuHeight={menuHeight || minMenuHeight}
      maxMenuHeight={menuHeight || maxMenuHeight || defaultMaxWidth}
      menuShouldScrollIntoView={menuShouldScrollIntoView}
      menuPlacement={menuPlacement}
      name={name}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      ref={ref}
      unstyled
      value={value}
      classNames={{
        control: (state) =>
          twMerge(
            'hover:cursor-pointer',
            !noBorder && `bg-bgPrimary dark:bg-bgPrimaryDark ${roundedStyle} ${borderStyle}`,
            !noBorder &&
              (state.isFocused
                ? 'border-bgCheckboxSelected dark:border-bgCheckboxSelectedDark'
                : 'border-borderSecondary dark:border-borderSecondaryDark'),
          ),
        dropdownIndicator: () =>
          variant == 'creatable' || noDropdown
            ? 'max-w-[0px] max-h-[0px]'
            : 'px-2 text-borderSecondary dark:text-borderSecondaryDark',
        indicatorsContainer: () =>
          twMerge(
            'rounded-sm',
            variant == 'creatable' || noDropdown ? 'max-h-[0px] max-w-[0px]' : 'py-1.5 ',
          ),
        indicatorSeparator: () => 'bg-borderSecondary dark:bg-borderSecondaryDark',
        menu: () => 'my-2 rounded-sm border border-borderThird dark:border-borderThirdDark',
        menuList: () => 'rounded-sm bg-bgPrimary dark:bg-bgPrimaryDark',

        option: (state) =>
          twMerge(
            'p-2 hover:cursor-pointer text-fgPrimary dark:text-fgPrimaryDark',
            state.isFocused
              ? 'bg-borderPrimary dark:bg-bgCheckboxSelectedDark'
              : state.isSelected && 'bg-borderSecondary dark:bg-borderPrimaryDark',
          ),
        container: () => twMerge('bg-bgPrimary dark:bg-bgPrimaryDark', roundedStyle, className),
        placeholder: () => 'text-midGray dark:text-midGrayDark',
        // no bg- in creatable
        valueContainer: () =>
          twMerge(
            'px-2 min-h-[40px] text-fgPrimary dark:text-fgPrimaryDark bg-bgPrimary dark:bg-bgPrimaryDark rounded-sm',
            variant == 'creatable' && !noBorder && 'p-1.5',
            variant == 'creatable' && 'gap-1',
          ),
        noOptionsMessage: () => 'rounded-sm p-2',
        clearIndicator: () => 'text-lightGray dark:text-lightGrayDark pr-2',

        // Async
        loadingMessage: () => 'rounded-sm p-2',
        loadingIndicator: () => 'text-lightGray dark:text-lightGrayDark pr-2',

        // Creatable
        input: () => (noRemove ? 'max-w-[0px] max-h-[0px]' : ''),
        multiValue: () => 'bg-bgButton dark:bg-bgButtonDark rounded-sm',
        multiValueLabel: () =>
          twMerge(
            'text-sm px-1.5 py-1 border-borderSecondary dark:border-borderSecondaryDark',
            noRemove
              ? 'border rounded-sm'
              : 'border-l border-y border-borderSecondary dark:border-borderSecondaryDark rounded-l rounded-y',
          ),
        multiValueRemove: () =>
          noRemove
            ? 'max-w-[0px] max-h-[0px] hidden'
            : 'pr-1 bg-bgButton dark:bg-bgButtonDark rounded-r border-r border-y border-borderSecondary dark:border-borderSecondaryDark',
      }}
      // Async
      cacheOptions={cacheOptions}
      getOptionLabel={getOptionLabel}
      loadOptions={loadOptions}
      // Creatable
      isMulti={isMulti}
      noOptionsMessage={noOptionsMessage}
    />
  );
};

export default Select;
