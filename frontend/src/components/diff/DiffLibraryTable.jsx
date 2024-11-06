import React from 'react';
import { DiffLibraryTableRow } from '@/components';

const DiffLibraryTable = ({
  cardChange,
  deckid,
  cards,
  cardsFrom,
  cardsTo,
  isEditable,
  showInfo,
  libraryTotal,
  handleClick,
}) => {
  return (
    <table className="w-full border-bgSecondary dark:border-bgSecondaryDark sm:border">
      <tbody>
        {cards.map((card) => {
          return (
            <DiffLibraryTableRow
              cardChange={cardChange}
              deckid={deckid}
              cardsFrom={cardsFrom}
              cardsTo={cardsTo}
              isEditable={isEditable}
              showInfo={showInfo}
              libraryTotal={libraryTotal}
              key={card.c[ID]}
              card={card}
              handleClick={handleClick}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default DiffLibraryTable;
