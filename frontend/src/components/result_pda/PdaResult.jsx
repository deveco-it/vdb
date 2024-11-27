import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { TwdDeck, TwdDeckWrapper, TwdResultTotal, Button, ButtonFloatClose } from '@/components';
import { decksSort } from '@/utils';
import { useApp } from '@/context';
import { CARDS, DECKID, DATE_NEW_OLD, DATE_OLD_NEW, FAVORITES } from '@/constants';

const PdaResult = ({ results }) => {
  const { isMobile, showFloatingButtons, pdaSearchSort, changePdaSearchSort } = useApp();
  const [, setSearchParams] = useSearchParams();
  const SHOW_COUNTER_STEP = 10;
  const deckCounter = results.length || 0;
  const [showCounter, setShowCounter] = useState(SHOW_COUNTER_STEP);
  const handleClear = () => setSearchParams();

  const sortMethods = {
    [DATE_NEW_OLD]: 'D↓',
    [DATE_OLD_NEW]: 'D↑',
    [FAVORITES]: 'F',
  };

  const sortedDecks = useMemo(() => {
    return decksSort(results, pdaSearchSort);
  }, [results, pdaSearchSort]);

  const showedDecks = useMemo(() => {
    return sortedDecks.slice(0, showCounter);
  }, [sortedDecks, showCounter, pdaSearchSort]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <TwdResultTotal
            results={results}
            sortMethods={sortMethods}
            sortMethod={pdaSearchSort}
            setSortMethod={changePdaSearchSort}
          />
          <div className="flex flex-col gap-4">
            {showedDecks.map((d) => {
              return d[CARDS] ? (
                <TwdDeck key={d[DECKID]} deck={d} inPda />
              ) : (
                <TwdDeckWrapper key={d[DECKID]} deckid={d[DECKID]} inPda />
              );
            })}
          </div>
        </div>
        {deckCounter > showCounter && (
          <div className="flex justify-center">
            <Button onClick={() => setShowCounter(showCounter + SHOW_COUNTER_STEP)}>
              Show More ({deckCounter - showCounter} left)
            </Button>
          </div>
        )}
      </div>
      {isMobile && showFloatingButtons && <ButtonFloatClose handleClose={handleClear} />}
    </>
  );
};

export default PdaResult;
