import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { useSwipeable } from 'react-swipeable';
import {
  UsedPopover,
  ButtonAddCard,
  ResultLibraryTableRowCommon,
  Tooltip,
} from 'components';
import { getHardTotal, getSoftMax } from 'utils';
import {
  useApp,
  deckStore,
  inventoryStore,
  usedStore,
  deckCardChange,
} from 'context';

const ResultLibraryTableRow = ({ card, handleClick, idx, placement }) => {
  const { addMode, inventoryMode, isDesktop } = useApp();
  const deck = useSnapshot(deckStore).deck;
  const inventoryLibrary = useSnapshot(inventoryStore).library;
  const usedLibrary = useSnapshot(usedStore).library;
  const inDeck = deck?.library[card.Id]?.q || 0;
  const isEditable = deck?.isAuthor && !deck?.isPublic && !deck?.isFrozen;

  const [isSwiped, setIsSwiped] = useState();
  const SWIPE_THRESHOLD = 50;
  const SWIPE_IGNORED_LEFT_EDGE = 30;
  const swipeHandlers = useSwipeable({
    onSwipedRight: (e) => {
      if (
        e.initial[0] > SWIPE_IGNORED_LEFT_EDGE &&
        e.absX > SWIPE_THRESHOLD &&
        isEditable &&
        addMode &&
        inDeck > 0
      ) {
        deckCardChange(deck.deckid, card, inDeck - 1);
      }
    },
    onSwipedLeft: (e) => {
      if (e.absX > SWIPE_THRESHOLD && isEditable && addMode) {
        deckCardChange(deck.deckid, card, inDeck + 1);
      }
    },
    onSwiped: () => {
      setIsSwiped(false);
    },
    onSwiping: (e) => {
      if (e.initial[0] > SWIPE_IGNORED_LEFT_EDGE && addMode) {
        if (e.deltaX < -SWIPE_THRESHOLD) {
          setIsSwiped('left');
        } else if (e.deltaX > SWIPE_THRESHOLD) {
          setIsSwiped('right');
        } else {
          setIsSwiped(false);
        }
      }
    },
  });

  const softUsedMax = getSoftMax(usedLibrary.soft[card.Id]);
  const hardUsedTotal = getHardTotal(usedLibrary.hard[card.Id]);
  const inInventory = inventoryLibrary[card.Id]?.q;

  const trBg = isSwiped
    ? isSwiped === 'left'
      ? 'bg-bgSuccess dark:bg-bgSuccessDark'
      : 'bg-bgErrorSecondary dark:bg-bgErrorSecondaryDark'
    : idx % 2
    ? 'bg-bgThird dark:bg-bgThirdDark'
    : 'bg-bgPrimary dark:bg-bgPrimaryDark';

  return (
    <tr
      {...swipeHandlers}
      className={`border-y border-bgSecondary dark:border-bgSecondaryDark ${trBg}`}
    >
      {isEditable && addMode && (
        <td className="quantity-add ">
          <ButtonAddCard deckid={deck.deckid} card={card} inDeck={inDeck} />
        </td>
      )}
      {inventoryMode && (
        <td className="used">
          <Tooltip
            placement={isDesktop ? 'left' : 'bottom'}
            overlay={<UsedPopover cardid={card.Id} />}
          >
            {(inInventory > 0 || softUsedMax + hardUsedTotal > 0) && (
              <div
                className={`used  flex items-center justify-between ${
                  inInventory < softUsedMax + hardUsedTotal
                    ? 'bg-bgError text-bgCheckbox dark:bg-bgErrorDark dark:text-bgCheckboxDark'
                    : ''
                }
                  `}
              >
                {inInventory}
                <div
                  className={`text-xs ${
                    inInventory >= softUsedMax + hardUsedTotal
                      ? 'text-midGray dark:text-midGrayDark'
                      : 'text-[#fff] dark:text-[#fff]'
                  } `}
                >
                  {inInventory >= softUsedMax + hardUsedTotal
                    ? `+${inInventory - softUsedMax - hardUsedTotal}`
                    : inInventory - softUsedMax - hardUsedTotal}
                </div>
              </div>
            )}
          </Tooltip>
        </td>
      )}
      <ResultLibraryTableRowCommon
        card={card}
        handleClick={handleClick}
        placement={placement}
      />
    </tr>
  );
};

export default ResultLibraryTableRow;
