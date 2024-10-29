import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useSnapshot } from 'valtio';
import {
  AccountLimitedDelCard,
  ButtonAddCard,
  ResultLibraryTableRowCommon,
  ResultUsed,
} from '@/components';
import { useApp, deckStore, deckCardChange } from '@/context';
import { useSwipe } from '@/hooks';
import { getSwipedBg } from '@/utils';
import { DECK } from '@/utils/constants';

const ResultLibraryTableRow = ({ card, handleClick, inLimited, shouldShowModal }) => {
  const { addMode, inventoryMode } = useApp();
  const deck = useSnapshot(deckStore)[DECK];
  const inDeck = deck?.library[card.Id]?.q || 0;
  const isEditable = deck?.isAuthor && !deck?.isPublic && !deck?.isFrozen;

  const { isSwiped, swipeHandlers } = useSwipe(
    () => deckCardChange(deck.deckid, card, inDeck - 1),
    () => deckCardChange(deck.deckid, card, inDeck + 1),
    isEditable && addMode,
    inDeck > 0,
  );

  return (
    <tr
      {...swipeHandlers}
      className={twMerge(
        'h-[38px] border-y border-bgSecondary dark:border-bgSecondaryDark',
        getSwipedBg(isSwiped),
      )}
    >
      {inLimited ? (
        <td className="min-w-[22px]">
          <AccountLimitedDelCard cardid={card.Id} target={inLimited} />
        </td>
      ) : (
        isEditable &&
        addMode && (
          <td>
            <ButtonAddCard deckid={deck.deckid} card={card} inDeck={inDeck} />
          </td>
        )
      )}
      {inventoryMode && (
        <td className="min-w-[60px]">
          <ResultUsed card={card} />
        </td>
      )}
      <ResultLibraryTableRowCommon
        card={card}
        handleClick={handleClick}
        shouldShowModal={shouldShowModal}
      />
    </tr>
  );
};

export default ResultLibraryTableRow;
