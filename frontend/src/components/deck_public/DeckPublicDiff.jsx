import React from 'react';
import { FlexGapped, DiffCrypt, DiffLibrary } from '@/components';

const DeckPublicDiff = ({ deckFrom, deckTo }) => {
  return (
    <FlexGapped className="max-sm:flex-col">
      <div className="md:basis-7/12">
        <DiffCrypt cardsFrom={deckFrom[CRYPT]} cardsTo={deckTo[CRYPT]} />
      </div>
      <div className="md:basis-5/12">
        <DiffLibrary cardsFrom={deckFrom[LIBRARY]} cardsTo={deckTo[LIBRARY]} />
      </div>
    </FlexGapped>
  );
};

export default DeckPublicDiff;
