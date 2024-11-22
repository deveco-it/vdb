import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { TwdDeck, TwdResultTotal, Button, ButtonFloatClose } from '@/components';
import { decksSort } from '@/utils';
import { useApp } from '@/context';
import { DECKID, DATE_NEW_OLD, DATE_OLD_NEW, FAVORITES } from '@/constants';

const PdaResult = ({ results, setResults }) => {
  const { isMobile, showFloatingButtons, pdaSearchSort, changePdaSearchSort } = useApp();
  const navigate = useNavigate();
  const showCounterStep = 10;
  const deckCounter = results.length || 0;
  const [showCounter, setShowCounter] = useState(showCounterStep);

  const sortMethods = {
    [DATE_NEW_OLD]: 'D↓',
    [DATE_OLD_NEW]: 'D↑',
    [FAVORITES]: 'F',
  };

  const handleClear = () => {
    navigate('/pda');
    setResults(undefined);
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
              return <TwdDeck key={d[DECKID]} deck={d} inPda />;
            })}
          </div>
        </div>
        {deckCounter > showCounter && (
          <div className="flex justify-center">
            <Button onClick={() => setShowCounter(showCounter + showCounterStep)}>
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
