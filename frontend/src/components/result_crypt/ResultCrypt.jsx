import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { useSearchParams } from 'react-router';
import {
  ResultTable,
  ResultCryptTotal,
  ResultCryptTotalInfo,
  ButtonFloatClose,
  ButtonFloatAdd,
  ErrorMessage,
} from '@/components';
import {
  CRYPT,
  DECK,
  CAPACITY_MAX_MIN,
  CAPACITY_MIN_MAX,
  CLAN,
  GROUP,
  NAME,
  SECT,
} from '@/constants';
import { getIsEditable } from '@/utils';
import { useApp, deckStore } from '@/context';

const ResultCrypt = ({ cards, inCompare }) => {
  const { isMobile, cryptSearchSort, changeCryptSearchSort, showFloatingButtons } = useApp();
  const [, setSearchParams] = useSearchParams();
  const deck = useSnapshot(deckStore)[DECK];
  const isEditable = getIsEditable(deck);
  const [showInfo, setShowInfo] = useState(false);
  const toggleShowInfo = () => setShowInfo(!showInfo);
  const handleClear = () => setSearchParams();

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
      {!isMobile && (cards === null || cards.length === 0) && (
        <ErrorMessage sticky>
          {cards === null ? 'CONNECTION PROBLEM' : 'NO CARDS FOUND'}
        </ErrorMessage>
      )}
      {cards && cards.length > 0 && (
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
      {isMobile && showFloatingButtons && (
        <>
          <ButtonFloatClose handleClose={handleClear} />
          {isEditable && <ButtonFloatAdd />}
        </>
      )}
    </>
  );
};

export default ResultCrypt;
