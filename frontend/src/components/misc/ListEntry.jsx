import React from 'react';

const ListEntry = ({ icon, title, children, basis = 4 }) => {
  const basises = {
    2: ['basis-1/2', 'basis-1/2'],
    3: ['basis-1/3', 'basis-2/3'],
    4: ['basis-1/4', 'basis-3/4'],
  };

  return (
    <div className="flex gap-2 max-sm:flex-col sm:items-center sm:justify-between sm:gap-4">
      <div
        className={`flex ${basises[basis][0]} items-center space-x-2 text-lg text-fgSecondary dark:text-fgSecondaryDark`}
      >
        {icon && <div className="flex min-w-[23px] justify-center">{icon}</div>}
        <div className="flex whitespace-nowrap font-bold">{title}</div>
      </div>
      <div className={`${basises[basis][1]}`}>{children}</div>
    </div>
  );
};

export default ListEntry;
