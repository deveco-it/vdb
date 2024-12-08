import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import PeopleFill from '@icons/people-fill.svg?react';
import { Spinner, ModalConfirmation, DeckPublicDiff, ButtonIconed } from '@/components';
import { deckServices } from '@/services';
import { useApp, deckStore } from '@/context';
import { PUBLIC_PARENT, NAME, DECKS } from '@/constants';

const DeckPublicSyncButton = ({ deck }) => {
  const { isDesktop, setShowMenuButtons, setShowFloatingButtons } = useApp();
  const decks = useSnapshot(deckStore)[DECKS];
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    deckServices
      .publicSync(deck, decks)
      .catch(() => {
        // TODO add catch error
      })
      .finally(() => {
        setIsLoading(false);
        setShowConfirmation(false);
        setShowMenuButtons(false);
        setShowFloatingButtons(true);
      });
  };

  return (
    <>
      <ButtonIconed
        variant={isDesktop ? 'secondary' : 'primary'}
        onClick={() => setShowConfirmation(true)}
        title="Sync Deck with Public Deck Archive"
        text="Sync Public Deck"
        icon={isLoading ? <Spinner /> : <PeopleFill />}
      />
      {showConfirmation && (
        <ModalConfirmation
          title={`Sync "${deck[NAME]}" with Public Deck Archive?`}
          buttonText="Sync"
          handleConfirm={handleClick}
          handleCancel={() => setShowConfirmation(false)}
        >
          <div>
            <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">
              Changes from currently published version:
            </div>
            <DeckPublicDiff deckTo={deck} deckFrom={decks[deck[PUBLIC_PARENT]]} />
          </div>
        </ModalConfirmation>
      )}
    </>
  );
};

export default DeckPublicSyncButton;
