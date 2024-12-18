import React from 'react';
import { useApp } from '@/context';
import {
  ResultLayoutTextInventory,
  ResultLayoutTextSets,
  ResultLayoutTextRulings,
  ResultLayoutTextArtist,
  PlaytestReportForm,
  Hr,
} from '@/components';
import { PLAYTEST_OLD, ID, ARTIST, RULINGS } from '@/constants';
import { getIsPlaytest } from '@/utils';

const ResultLayoutTextCommon = ({
  handleClose,
  card,
  forceInventoryMode,
  inPopover,
  setIsHotkeysDisabled,
}) => {
  const { isPlaytester, inventoryMode } = useApp();
  const isPlaytest = getIsPlaytest(card[ID]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">Sets:</div>
        <ResultLayoutTextSets card={card} />
      </div>
      <div className="flex gap-2">
        <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">Artist:</div>
        <div className="flex flex-wrap gap-x-2.5 gap-y-0.5">
          <ResultLayoutTextArtist
            handleClose={handleClose}
            inCrypt={card[ID] > 200000}
            artists={card[ARTIST]}
          />
        </div>
      </div>
      {Object.keys(card[RULINGS]).length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">Rulings:</div>
          <ResultLayoutTextRulings rulings={card[RULINGS]} />
        </div>
      )}
      {!isPlaytest && (forceInventoryMode || inventoryMode) && (
        <>
          <Hr />
          <div className="flex flex-col gap-1">
            <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">Inventory:</div>
            <ResultLayoutTextInventory
              card={card}
              inPopover={inPopover}
              setIsHotkeysDisabled={setIsHotkeysDisabled}
            />
          </div>
        </>
      )}
      {!inPopover && isPlaytester && isPlaytest && !card[PLAYTEST_OLD] && (
        <>
          <Hr />
          <PlaytestReportForm id={card[ID]} setIsHotkeysDisabled={setIsHotkeysDisabled} />
        </>
      )}
    </div>
  );
};

export default ResultLayoutTextCommon;
