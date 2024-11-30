import React from 'react';
import { twMerge } from 'tailwind-merge';
import Shuffle from '@icons/shuffle.svg?react';
import PinAngleFill from '@icons/pin-angle-fill.svg?react';
import { getIsEditable } from '@/utils';
import { cardToggleInventoryState } from '@/context';
import { DECKID, ID, S, INVENTORY_TYPE } from '@/constants';

const DeckCardToggleInventoryStateTd = ({ card, deck }) => {
  const isEditable = getIsEditable(deck);

  return (
    <td className="group max-w-0">
      <div className="relative flex items-center">
        <div
          className={twMerge(
            'absolute left-[-24px]',
            !card.i && 'opacity-0',
            !card.i && isEditable && 'group-hover:opacity-[0.35]',
          )}
          onClick={() => isEditable && cardToggleInventoryState(deck[DECKID], card.c[ID])}
        >
          {deck[INVENTORY_TYPE] == S ? <PinAngleFill /> : <Shuffle />}
        </div>
      </div>
    </td>
  );
};

export default DeckCardToggleInventoryStateTd;
