import React from 'react';
import { useSnapshot } from 'valtio';
import {
  CardPopover,
  UsedPopover,
  ResultName,
  ResultLibraryTypeImage,
  ResultLibraryDisciplines,
  ResultLibraryClan,
  ConditionalTooltip,
} from '@/components';
import { useApp, limitedStore, inventoryStore, usedStore } from '@/context';
import { getHardTotal } from '@/utils';

const TwdResultLibraryKeyCardsTableRow = ({ card, idx, handleClick }) => {
  const { limitedMode, inventoryMode, isMobile } = useApp();
  const inventoryLibrary = useSnapshot(inventoryStore).library;
  const limitedLibrary = useSnapshot(limitedStore).library;
  const usedLibrary = useSnapshot(usedStore).library;
  const inInventory = limitedMode
    ? limitedLibrary[card.c.Id]
      ? 99
      : 0
    : inventoryLibrary[card.c.Id]?.q ?? 0;
  const hardUsedTotal = getHardTotal(usedLibrary.hard[card.c.Id]);

  return (
    <tr
      key={card.c.Id}
      className={`border-y border-bgSecondary dark:border-bgSecondaryDark ${
        idx % 2
          ? 'bg-bgThird dark:bg-bgThirdDark'
          : 'bg-bgPrimary dark:bg-bgPrimaryDark'
      }`}
    >
      <td className="min-w-[28px] border-r border-bgSecondary bg-blue/5 dark:border-bgSecondaryDark sm:min-w-[35px]">
        {limitedMode || inventoryMode ? (
          <ConditionalTooltip
            overlay={<UsedPopover cardid={card.c.Id} />}
            disabled={isMobile}
          >
            <div
              className={`flex justify-center text-lg ${
                inInventory < card.q
                  ? 'bg-bgError text-bgCheckbox dark:bg-bgErrorDark dark:text-bgCheckboxDark'
                  : inInventory - hardUsedTotal < card.q
                  ? 'bg-bgWarning dark:bg-bgWarningDark'
                  : ''
              }`}
            >
              {card.q}
            </div>
          </ConditionalTooltip>
        ) : (
          <div className="flex justify-center text-lg">{card.q}</div>
        )}
      </td>
      <td className="min-w-[55px]" onClick={() => handleClick(card.c)}>
        <div className="flex justify-center">
          <ResultLibraryTypeImage value={card.c.Type} />
        </div>
      </td>
      <td className="w-full" onClick={() => handleClick(card.c)}>
        <ConditionalTooltip
          overlay={<CardPopover card={card.c} />}
          disabled={isMobile}
          noPadding
        >
          <div className="flex cursor-pointer">
            <ResultName card={card.c} />
          </div>
        </ConditionalTooltip>
      </td>
      {!isMobile && (
        <td
          className="min-w-[62px] 2xl:min-w-[85px]"
          onClick={() => handleClick(card.c)}
        >
          <div className="flex items-center justify-center">
            {card.c.Discipline && (
              <ResultLibraryDisciplines value={card.c.Discipline} />
            )}
            {card.c.Discipline && card.c.Clan && '+'}
            {card.c.Clan && <ResultLibraryClan value={card.c.Clan} />}
          </div>
        </td>
      )}
    </tr>
  );
};

export default TwdResultLibraryKeyCardsTableRow;
