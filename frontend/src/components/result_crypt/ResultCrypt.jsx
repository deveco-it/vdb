import React, { useState } from 'react';
import { ResultTable, ResultCryptTotal, ResultCryptTotalInfo, ErrorMessage } from '@/components';
import { CRYPT, CAPACITY_MAX_MIN, CAPACITY_MIN_MAX, CLAN, GROUP, NAME, SECT } from '@/constants';
import { useApp } from '@/context';

const ResultCrypt = ({ cards, inCompare }) => {
  const { cryptSearchSort, changeCryptSearchSort } = useApp();
  const [showInfo, setShowInfo] = useState(false);
  const toggleShowInfo = () => setShowInfo(!showInfo);

  const sortMethods = {
    [CAPACITY_MAX_MIN]: 'C↓',
    [CAPACITY_MIN_MAX]: 'C↑',
    [CLAN]: 'CL',
    [GROUP]: 'G',
    [NAME]: 'N',
    [SECT]: 'S',
  };

  return (
    <>
      {cards === null || cards.length === 0 ? (
        <ErrorMessage sticky>
          {cards === null ? 'CONNECTION PROBLEM' : 'NO CARDS FOUND'}
        </ErrorMessage>
      ) : (
        <>
          <ResultCryptTotal
            inCompare={inCompare}
            cards={cards}
            toggleShowInfo={toggleShowInfo}
            sortMethods={sortMethods}
            sortMethod={cryptSearchSort}
            setSortMethod={changeCryptSearchSort}
          />
          {showInfo && (
            <div className="bg-bgSecondary p-2 dark:bg-bgSecondaryDark">
              <ResultCryptTotalInfo cards={cards} />
            </div>
          )}
          <ResultTable cards={cards} target={CRYPT} />
        </>
      )}
    </>
  );
};

export default ResultCrypt;
