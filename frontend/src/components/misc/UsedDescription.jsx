import React from 'react';
import Shuffle from '@/assets/images/icons/shuffle.svg?react';
import PinAngleFill from '@/assets/images/icons/pin-angle-fill.svg?react';
import { S } from '@/constants';

const UsedDescriptionDeck = ({ deck, t, q }) => {
  const isBranches = deck[MASTER] || (deck[BRANCHES] && deck[BRANCHES].length > 0);

  return (
    <div className="flex items-center gap-1">
      <div className="opacity-40">
        {t == S ? (
          <Shuffle width="16" height="16" viewBox="0 0 16 16" />
        ) : (
          <PinAngleFill width="16" height="16" viewBox="0 0 16 16" />
        )}
      </div>
      <b>{q}</b>
      <div className="truncate sm:max-w-[265px] md:max-w-[290px]">
        {` - ${deck[NAME]}${isBranches ? ` [${deck[BRANCH_NAME]}]` : ''} `}
      </div>
    </div>
  );
};

const UsedDescription = ({ usedCards, decks, inventoryType }) => {
  return (
    <>
      {Object.keys(usedCards).map((id) => {
        return (
          <UsedDescriptionDeck key={id} q={usedCards[id]} deck={decks[id]} t={inventoryType} />
        );
      })}
    </>
  );
};

export default UsedDescription;
