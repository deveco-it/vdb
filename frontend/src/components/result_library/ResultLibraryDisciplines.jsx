import React from 'react';
import { ResultDisciplineImage } from '@/components';

const ResultLibraryDisciplines = ({ value }) => {
  if (value.indexOf('&') != -1) {
    const disciplines = value.split(' & ');
    return (
      <div className="flex min-w-[55px] flex-wrap items-center justify-center">
        <ResultDisciplineImage value={disciplines[0]} />+
        <ResultDisciplineImage value={disciplines[1]} />
      </div>
    );
  } else if (value.indexOf('/') != -1) {
    const disciplines = value.split('/');
    return (
      <div className="flex min-w-[55px] flex-wrap items-center justify-center">
        {disciplines.map((d, idx) => {
          return (
            <React.Fragment key={idx}>
              <ResultDisciplineImage value={d} />
              {idx + 1 < disciplines.length && '/'}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return <ResultDisciplineImage value={value} />;
};

export default ResultLibraryDisciplines;
