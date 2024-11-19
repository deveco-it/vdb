import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useSnapshot } from 'valtio';
import {
  ResultName,
  ResultCryptCapacity,
  ResultCryptDisciplines,
  ResultClanImage,
} from '@/components';
import { useApp, inventoryStore } from '@/context';
import { CRYPT, GROUP, CLAN, DISCIPLINES, ANY, X } from '@/constants';

const SelectLabelCrypt = ({ cardid, inInventory }) => {
  const { cryptCardBase } = useApp();
  const inventoryCrypt = useSnapshot(inventoryStore)[CRYPT];
  const card = cryptCardBase[cardid];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {inInventory && (
            <div
              className={twMerge(
                'inline w-7 text-center text-lg',
                inventoryCrypt[cardid] &&
                  'rounded-md border-2 border-midGray dark:border-midGrayDark',
              )}
            >
              {inventoryCrypt[cardid]?.q}
            </div>
          )}
          <div className="min-w-[24px]">
            <ResultCryptCapacity card={card} />
          </div>
          <ResultName card={card} isColored={false} />
          <div className="inline text-midGray dark:text-midGrayDark">
            [G
            <div className="inline text-fgPrimary dark:text-fgPrimaryDark">
              {card[GROUP] == ANY ? X : card[GROUP]}
            </div>
            ]
          </div>
          <ResultClanImage value={card[CLAN]} />
        </div>
        <div className="flex whitespace-nowrap">
          <ResultCryptDisciplines value={card[DISCIPLINES]} />
        </div>
      </div>
    </>
  );
};

export default SelectLabelCrypt;
