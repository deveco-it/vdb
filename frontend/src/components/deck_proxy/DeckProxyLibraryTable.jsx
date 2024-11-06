import React from 'react';
import { DeckProxyLibraryTableRow } from '@/components';

const DeckProxyLibraryTable = ({
  inventoryType,
  handleClick,
  cards,
  proxySelected,
  handleProxySelector,
  handleProxyCounter,
  handleSetSelector,
}) => {
  return (
    <table className="w-full border-bgSecondary dark:border-bgSecondaryDark sm:border">
      <tbody>
        {cards.map((card) => {
          return (
            <DeckProxyLibraryTableRow
              key={card.c[ID]}
              inventoryType={inventoryType}
              card={card}
              handleClick={handleClick}
              proxySelected={proxySelected}
              handleProxySelector={handleProxySelector}
              handleProxyCounter={handleProxyCounter}
              handleSetSelector={handleSetSelector}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default DeckProxyLibraryTable;
