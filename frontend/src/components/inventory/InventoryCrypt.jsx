import React, { useEffect, useState } from 'react';
import {
  InventoryCryptTable,
  InventoryFilterForm,
  SortButton,
} from '@/components';
import { useInventoryCrypt } from '@/hooks';

const InventoryCrypt = ({
  compact,
  withCompact,
  category,
  cards,
  clan,
  setClan,
  newFocus,
  setMissingCryptByClan,
  inShared,
}) => {
  const [sortMethod, setSortMethod] = useState('Name');
  const sortMethods = {
    Name: 'N',
    Quantity: 'Q',
    Clan: 'CL',
    Group: 'G',
    'Capacity - Min to Max': 'C↑',
    'Capacity - Max to Min': 'C↓',
  };

  const {
    cardsByClan,
    cardsByClanTotal,
    cardsByClanUnique,
    missingByClan,
    missingByClanTotal,
  } = useInventoryCrypt(cards, category, compact);

  useEffect(() => {
    if (!compact) setMissingCryptByClan(missingByClan);
  }, [cards]);

  return (
    <>
      {!compact && (
        <div className="flex items-center justify-between bg-bgSecondary dark:bg-bgSecondaryDark">
          <div className="w-3/4 p-1">
            <InventoryFilterForm
              value={clan}
              setValue={setClan}
              values={Object.keys(cardsByClan).filter((i) => {
                return Object.keys(cardsByClan[i]).length;
              })}
              byTotal={cardsByClanTotal}
              byUnique={cardsByClanUnique}
              target="crypt"
            />
            <div className="flex justify-end font-bold  text-midGray dark:text-midGrayDark">
              {missingByClanTotal[clan] ? (
                <>
                  {missingByClanTotal[clan]} (
                  {Object.values(missingByClan[clan]).length} uniq) miss
                </>
              ) : null}
            </div>
          </div>
          <SortButton
            sortMethods={sortMethods}
            sortMethod={sortMethod}
            setSortMethod={setSortMethod}
          />
        </div>
      )}
      <InventoryCryptTable
        sortMethod={sortMethod}
        compact={compact}
        withCompact={withCompact}
        cards={
          compact
            ? Object.values(cardsByClan['All'])
            : Object.values(cardsByClan[clan])
        }
        newFocus={newFocus}
        inShared={inShared}
      />
    </>
  );
};

export default InventoryCrypt;
