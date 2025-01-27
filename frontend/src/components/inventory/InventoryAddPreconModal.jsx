import React, { useState, useMemo } from 'react';
import { InventoryAddPreconHeader, InventoryAddPreconRow, Modal } from '@/components';
import { decksSort } from '@/utils';
import { DECKID, NAME, DATE, PLAYTEST } from '@/constants';
import { useApp } from '@/context';
import setsAndPrecons from '@/assets/data/setsAndPrecons.json';

const InventoryAddPreconModal = ({ handleClose }) => {
  const { preconDecks, isMobile } = useApp();
  const [sortMethod, setSortMethod] = useState(DATE);
  const [nameFilter, setNameFilter] = useState('');
  const [setFilter, setSetFilter] = useState('');

  const handleChangeNameFilter = (event) => {
    setNameFilter(event.target.value);
  };

  const handleChangeSetFilter = (event) => {
    setSetFilter(event.target.value);
  };

  const sortedDecks = useMemo(() => {
    if (Object.values(preconDecks).length > 0) {
      let filtered = Object.values(preconDecks).filter((i) => {
        return !i[DECKID].includes(PLAYTEST);
      });

      if (nameFilter) {
        filtered = filtered.filter((deck) => {
          if (deck[NAME].toLowerCase().indexOf(nameFilter.toLowerCase()) >= 0) return true;
        });
      }

      if (setFilter) {
        filtered = filtered.filter((deck) => {
          const set = deck[DECKID].split(':')[0];
          if (setsAndPrecons[set][NAME].toLowerCase().indexOf(setFilter.toLowerCase()) >= 0)
            return true;
        });
      }

      return decksSort(filtered, sortMethod);
    } else {
      return [];
    }
  }, [preconDecks, nameFilter, setFilter, sortMethod]);

  return (
    <Modal noPadding={isMobile} handleClose={handleClose} title="Import Precon to Inventory">
      <table className="inv-import-precons-table border-bgSecondary dark:border-bgSecondaryDark sm:border">
        <InventoryAddPreconHeader
          handleChangeNameFilter={handleChangeNameFilter}
          setSortMethod={setSortMethod}
          nameFilter={nameFilter}
          sortMethod={sortMethod}
          setFilter={setFilter}
          handleChangeSetFilter={handleChangeSetFilter}
        />
        <tbody>
          {sortedDecks.map((deck) => {
            return <InventoryAddPreconRow key={deck[DECKID]} deck={deck} />;
          })}
        </tbody>
      </table>
    </Modal>
  );
};

export default InventoryAddPreconModal;
