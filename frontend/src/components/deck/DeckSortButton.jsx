import React from 'react';
import { SortButton } from '@/components';
import { NAME, DATE } from '@/constants';

const DeckSortButton = ({ sortMethod, onChange, noText }) => {
  const sortMethods = { [NAME]: 'Name', [DATE]: 'Date' };

  return (
    <SortButton
      sortMethod={sortMethod}
      sortMethods={sortMethods}
      setSortMethod={onChange}
      noText={noText}
    />
  );
};

export default DeckSortButton;
