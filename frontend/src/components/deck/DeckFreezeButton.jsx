import React from 'react';
import LockFill from '@icons/lock-fill.svg?react';
import UnlockFill from '@icons/unlock-fill.svg?react';
import { deckUpdate } from '@/context';
import { Button } from '@/components';
import { DECKID, IS_FROZEN } from '@/constants';

const DeckFreezeButton = ({ deck, className, roundedStyle, borderStyle }) => {
  const handleClick = () => {
    deckUpdate(deck[DECKID], IS_FROZEN, !deck[IS_FROZEN]);
  };

  return (
    <Button
      onClick={handleClick}
      title={`${deck[IS_FROZEN] ? 'Disabled' : 'Enabled'} Crypt/Library Editing`}
      className={className}
      roundedStyle={roundedStyle}
      borderStyle={borderStyle}
    >
      <>
        {deck[IS_FROZEN] ? (
          <LockFill width="18" height="23" viewBox="0 0 16 16" />
        ) : (
          <UnlockFill width="18" height="23" viewBox="0 0 16 16" />
        )}
      </>
    </Button>
  );
};

export default DeckFreezeButton;
