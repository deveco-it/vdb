import React, { useState, useMemo } from 'react';
import {
  DeckSortButton,
  InventoryAddPreconRow,
  ConditionalTooltipOrModal,
  Modal,
  Input,
} from '@/components';
import { decksSort } from '@/utils';
import { PLAYTEST } from '@/utils/constants';
import { useApp } from '@/context';
import setsAndPrecons from '@/assets/data/setsAndPrecons.json';

const TooltipText = () => {
  return (
    <div className="flex flex-col gap-1">
      <div>
        Numbers below represent maximum quantity of particular precon you can
        assemble from your inventory.
      </div>
      <div>
        Every precon calculated separately using your entire inventory, meaning
        real number of precons you will be able to assemble is smaller as every
        other precon will consume some cards and they will not be available
        anymore.
      </div>
      <div>
        VDB does not track particular precons you added, and calculation
        performed from just card numbers in the inventory regardless of how they
        appeared there.
      </div>
    </div>
  );
};

const InventoryAddPreconModal = ({ handleClose }) => {
  const { preconDecks, isDesktop, isMobile } = useApp();
  const [sortMethod, setSortMethod] = useState('byDate');
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
        return !i.deckid.includes(PLAYTEST);
      });

      if (nameFilter) {
        filtered = filtered.filter((deck) => {
          if (deck.name.toLowerCase().indexOf(nameFilter.toLowerCase()) >= 0)
            return true;
        });
      }

      if (setFilter) {
        filtered = filtered.filter((deck) => {
          const set = deck.deckid.split(':')[0];
          if (
            setsAndPrecons[set].name
              .toLowerCase()
              .indexOf(setFilter.toLowerCase()) >= 0
          )
            return true;
        });
      }

      return decksSort(filtered, sortMethod);
    } else {
      return [];
    }
  }, [preconDecks, nameFilter, setFilter, sortMethod]);

  return (
    <Modal
      handleClose={handleClose}
      size="xl"
      title="Import Precon to Inventory"
    >
      <div>
        <table className="inv-import-precons-table border-bgSecondary dark:border-bgSecondaryDark sm:border">
          <thead>
            <tr>
              {!isMobile && <th className="min-w-[50px]"></th>}
              <th className="min-w-[230px] sm:min-w-[250px]">
                <Input
                  placeholder="Filter by Name"
                  type="text"
                  name="text"
                  autoComplete="off"
                  spellCheck="false"
                  value={nameFilter}
                  onChange={handleChangeNameFilter}
                />
              </th>
              {isDesktop && <th className="min-w-[40px]"></th>}
              <th className="w-full">
                <Input
                  placeholder="Filter by Set"
                  type="text"
                  name="text"
                  autoComplete="off"
                  spellCheck="false"
                  value={setFilter}
                  onChange={handleChangeSetFilter}
                />
              </th>
              <th className="min-w-[110px]">
                <div className="flex items-center justify-end gap-1">
                  <ConditionalTooltipOrModal
                    className="basis-full"
                    title="Precon Quantity"
                    isModal={isMobile}
                    overlay={<TooltipText />}
                  >
                    <div className="flex basis-full justify-center text-fgThird dark:text-fgThirdDark">
                      [?]
                    </div>
                  </ConditionalTooltipOrModal>
                  <DeckSortButton onChange={setSortMethod} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDecks.map((deck, idx) => {
              return (
                <InventoryAddPreconRow
                  key={deck.deckid}
                  deck={deck}
                  idx={idx}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default InventoryAddPreconModal;
