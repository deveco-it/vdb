import React from 'react';
import { Select } from '@/components';
import cryptArtists from '@/assets/data/artistsCrypt.json';
import libraryArtists from '@/assets/data/artistsLib.json';
import { useApp } from '@/context';
import { CRYPT, ANY } from '@/utils/constants';

const SearchFormArtist = ({ target, value, onChange }) => {
  const { isXWide } = useApp();
  const name = 'artist';
  const maxMenuHeight = isXWide ? 500 : 350;
  const artists = target == CRYPT ? cryptArtists : libraryArtists;

  const options = artists.map((artist) => {
    return {
      name: name,
      value: artist,
      label: artist,
    };
  });

  options.unshift({
    name: name,
    value: ANY,
    label: (
      <div className="flex items-center">
        <div className="flex w-[40px]" />
        ANY
      </div>
    ),
  });

  return (
    <div className="flex items-center">
      <div className="w-1/4">
        <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">Artist:</div>
      </div>
      <div className="w-3/4">
        <Select
          options={options}
          isClearable={value !== ANY}
          maxMenuHeight={maxMenuHeight}
          name={name}
          placeholder="Artist"
          value={options.find((obj) => obj.value === value)}
          onChange={(e) => onChange(e ?? { name: name, value: ANY })}
        />
      </div>
    </div>
  );
};

export default SearchFormArtist;
