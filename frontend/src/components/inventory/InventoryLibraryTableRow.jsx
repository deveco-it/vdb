import React from 'react';
import { useSnapshot } from 'valtio';
import {
  CardPopover,
  InventoryCardQuantity,
  InventoryCardQuantityDiff,
  ResultLibraryClan,
  ResultLibraryCost,
  ResultLibraryTypeImage,
  ResultLibraryDisciplines,
  ResultMiscImage,
  ResultName,
  ConditionalTooltip,
} from '@/components';
import { LIBRARY, TRIFLE, POOL_COST, BLOOD_COST, BURN_OPTION } from '@/utils/constants';
import { getHardTotal, getSoftMax } from '@/utils';
import { useApp, inventoryStore, usedStore, limitedStore, inventoryCardChange } from '@/context';
import { useSwipe } from '@/hooks';

const InventoryLibraryTableRow = ({ card, compact, newFocus, inShared, handleClick }) => {
  const { isMobile, isNarrow, limitedMode } = useApp();
  const usedLibrary = useSnapshot(usedStore)[LIBRARY];
  const limitedLibrary = useSnapshot(limitedStore)[LIBRARY];
  const inLimited = limitedLibrary[card.c.Id];
  const softUsedMax = getSoftMax(usedLibrary.soft[card.c.Id]);
  const hardUsedTotal = getHardTotal(usedLibrary.hard[card.c.Id]);
  const isEditable = !useSnapshot(inventoryStore).isFrozen;

  const { isSwiped, swipeHandlers } = useSwipe(
    () => inventoryCardChange(card.c, card.q - 1),
    () => inventoryCardChange(card.c, card.q + 1),
  );

  const trBg = isSwiped
    ? isSwiped === 'right'
      ? 'bg-bgSuccess dark:bg-bgSuccessDark'
      : 'bg-bgErrorSecondary dark:bg-bgErrorSecondaryDark'
    : '';

  return (
    <div className={`flex w-full items-center ${trBg}`} {...swipeHandlers}>
      {inShared ? (
        <div className="flex h-full min-w-[42px] border-r border-bgSecondary bg-blue/5 dark:border-bgSecondaryDark sm:min-w-[48px]">
          {card.q || null}
        </div>
      ) : (
        <div
          className={`flex ${isEditable ? 'min-w-[84px]' : 'h-full min-w-[42px] border-r border-bgSecondary bg-blue/5 dark:border-bgSecondaryDark sm:min-w-[48px]'}`}
        >
          <InventoryCardQuantity
            card={card}
            softUsedMax={softUsedMax}
            hardUsedTotal={hardUsedTotal}
            compact={compact}
            newFocus={newFocus}
          />
        </div>
      )}
      {!inShared && (
        <div className="flex min-w-[40px] justify-center">
          <InventoryCardQuantityDiff
            card={card}
            softUsedMax={softUsedMax}
            hardUsedTotal={hardUsedTotal}
          />
        </div>
      )}
      <div className="flex min-w-[40px] justify-center" onClick={() => handleClick(card.c)}>
        <ResultLibraryTypeImage value={card.c.Type} />
      </div>
      <div className="flex w-full" onClick={() => handleClick(card.c)}>
        <ConditionalTooltip
          overlay={<CardPopover card={card.c} />}
          disabled={isMobile}
          className="flex w-full"
          noPadding
        >
          <div className="flex cursor-pointer">
            <ResultName card={card.c} isBanned={limitedMode && !inLimited} />
          </div>
        </ConditionalTooltip>
      </div>
      {isMobile ? (
        <div className="flex min-w-[82px] justify-between" onClick={() => handleClick(card.c)}>
          {(card.c[BLOOD_COST] || card.c[POOL_COST]) && (
            <div
              className={`flex min-w-[22px] justify-center ${card.c[BLOOD_COST] && 'pb-1'}`}
              onClick={() => handleClick(card.c)}
            >
              <ResultLibraryCost valueBlood={card.c[BLOOD_COST]} valuePool={card.c[POOL_COST]} />
            </div>
          )}
          <div className="flex w-full items-center justify-end" onClick={() => handleClick(card.c)}>
            {card.c.Clan && <ResultLibraryClan value={card.c.Clan} />}
            {card.c.Discipline && card.c.Clan && '+'}
            {card.c.Discipline && <ResultLibraryDisciplines value={card.c.Discipline} />}
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flex min-w-[30px] justify-center ${card.c[BLOOD_COST] && 'pb-1'}`}
            onClick={() => handleClick(card.c)}
          >
            {(card.c[BLOOD_COST] || card.c[POOL_COST]) && (
              <ResultLibraryCost valueBlood={card.c[BLOOD_COST]} valuePool={card.c[POOL_COST]} />
            )}
          </div>
          <div className="flex min-w-[82px] justify-center" onClick={() => handleClick(card.c)}>
            {card.c.Clan && <ResultLibraryClan value={card.c.Clan} />}
            {card.c.Discipline && card.c.Clan && '+'}
            {card.c.Discipline && <ResultLibraryDisciplines value={card.c.Discipline} />}
          </div>
        </>
      )}
      {!isNarrow && (
        <div className="flex min-w-[30px] justify-center" onClick={() => handleClick(card.c)}>
          {card.c[BURN_OPTION] && <ResultMiscImage value={BURN_OPTION} />}
          {card.c[TRIFLE] && <ResultMiscImage value={TRIFLE} />}
        </div>
      )}
    </div>
  );
};

export default InventoryLibraryTableRow;
