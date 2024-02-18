import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import TrashFill from '@/assets/images/icons/trash-fill.svg?react';
import { ButtonIconed, ModalConfirmation } from '@/components';
import { deckStore, useApp } from '@/context';
import { byTimestamp } from '@/utils';

const DeckDeleteButton = ({ deck, noText }) => {
  const { isDesktop, setShowFloatingButtons, setShowMenuButtons } = useApp();
  const decks = useSnapshot(deckStore).decks;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => setShowConfirmation(false);
  const handleConfirm = () => {
    deleteDeck();
  };

  const getLastDeckExcept = () => {
    const lastDecks = Object.values(decks)
      .filter((d) => {
        if (d.branches && d.branches.includes(deck.deckid)) return false;
        if (d.master) return false;
        if (d.deckid === deck.deckid) return false;
        return true;
      })
      .toSorted(byTimestamp)
      .map((d) => d.deckid);

    return lastDecks[0] || null;
  };

  const deleteDeck = () => {
    const url = `${import.meta.env.VITE_API_URL}/deck/${deck.deckid}`;
    const options = {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(url, options).then(() => {
      delete deckStore.decks[deck.master ?? deck.deckid];

      setShowConfirmation(false);
      setShowMenuButtons(false);
      setShowFloatingButtons(true);

      const lastDeckId = getLastDeckExcept();
      navigate(lastDeckId ? `/decks/${lastDeckId}` : '/decks');
    });
  };

  return (
    <>
      <ButtonIconed
        variant={noText || !isDesktop ? 'primary' : 'secondary'}
        onClick={() => setShowConfirmation(true)}
        title="Delete Deck"
        icon={
          <TrashFill
            width={noText ? '18' : '18'}
            height={noText ? '22' : '18'}
            viewBox="0 0 18 16"
          />
        }
        text={noText ? null : 'Delete'}
      />
      {showConfirmation && (
        <ModalConfirmation
          withWrittenConfirmation={deck.isBranches}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          title={`Delete deck "${deck.name}" and all its revisions`}
          buttonText="Delete"
          buttonVariant="danger"
        >
          THIS CANNOT BE UNDONE!
        </ModalConfirmation>
      )}
    </>
  );
};

export default DeckDeleteButton;
