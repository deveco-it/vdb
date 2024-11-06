import React from 'react';
import { Radio } from '@/components';
import { MY, ANY, SRC, MY_NONPUBLIC, FAVORITES } from '@/constants';

const PdaSearchFormSrcSelector = ({ value, onChange }) => {
  return (
    <div className="flex gap-4 sm:gap-6">
      {[
        [ANY, 'All'],
        [FAVORITES, 'Favorites'],
        [MY, 'My'],
        [MY_NONPUBLIC, 'My Non-Public'],
      ].map((i) => (
        <Radio
          key={i[0]}
          checked={value == i[0]}
          onChange={onChange}
          value={i[1]}
          name={SRC}
          id={i[0]}
        />
      ))}
    </div>
  );
};

export default PdaSearchFormSrcSelector;
