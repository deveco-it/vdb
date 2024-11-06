import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';

const SeatingTablePlayer = ({ deck, isFirst }) => {
  return (
    <div
      className={twMerge(
        'flex justify-center sm:whitespace-nowrap',
        isFirst
          ? 'rounded-md border-2 border-dashed border-borderPrimary p-3 font-bold dark:border-borderPrimaryDark'
          : 'p-3.5',
      )}
    >
      {deck.deckid ? (
        <Link target="_blank" rel="noreferrer" to={`/decks/${deck.deckid}`}>
          {deck[NAME]}
        </Link>
      ) : (
        <>{deck[NAME]}</>
      )}
    </div>
  );
};

export default SeatingTablePlayer;
