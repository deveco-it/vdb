import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ResultDisciplineImage } from '@/components';
import disciplinesList from '@/assets/data/disciplinesList.json';

const CryptSearchFormDisciplines = ({ value, onChange, withMalStr }) => {
  const disciplines = withMalStr
    ? [...Object.keys(disciplinesList), 'Flight', 'Maleficia', 'Striga'].toSorted()
    : Object.keys(disciplinesList);

  return (
    <div className="flex flex-wrap">
      {disciplines.map((i) => (
        <div
          key={i}
          className={twMerge(
            'flex h-[39px] w-[39px] cursor-pointer items-center justify-center',
            !value[i] && 'opacity-40',
          )}
          onClick={() => onChange(i, 2)}
        >
          <ResultDisciplineImage size="xl" value={i} isSuperior={value[i] === 2} />
        </div>
      ))}
    </div>
  );
};

export default CryptSearchFormDisciplines;
