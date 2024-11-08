import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { DeckCryptTable, DeckCryptHeader, ResultModal, FlexGapped } from '@/components';
import { useApp } from '@/context';
import { getIsEditable } from '@/utils';
import { useModalCardController, useKeyDisciplines, useDeckCrypt } from '@/hooks';
import { DECKID, CRYPT } from '@/constants';

const DeckCrypt = ({ inSearch, inPreview, inMissing, noDisciplines, deck }) => {
  const { setShowFloatingButtons, cryptDeckSort, changeCryptDeckSort, isMobile } = useApp();
  const isEditable = getIsEditable(deck);
  const [showInfo, setShowInfo] = useState(false);

  const sortMethods = {
    Capacity: 'C',
    Clan: 'CL',
    Group: 'G',
    Name: 'N',
    'Quantity ': 'Q', // SPACE SUFFIX IS INTENTIONAL
    Sect: 'S',
  };

  const {
    crypt,
    cryptSide,
    sortedCards,
    sortedCardsSide,
    hasBanned,
    hasLimited,
    hasPlaytest,
    hasIllegalDate,
    hasWrongGroups,
    cryptGroups,
    cryptTotal,
  } = useDeckCrypt(deck[CRYPT], cryptDeckSort);

  const { disciplinesSet, keyDisciplines } = useKeyDisciplines(deck[CRYPT]);

  const {
    currentModalCard,
    shouldShowModal,
    handleModalCardOpen,
    handleModalSideCardOpen,
    handleModalCardChange,
    handleModalCardClose,
  } = useModalCardController(sortedCards, sortedCardsSide);

  const handleClick = (card) => {
    handleModalCardOpen(card);
    setShowFloatingButtons(false);
  };

  const handleClickSide = (card) => {
    handleModalSideCardOpen(card);
    setShowFloatingButtons(false);
  };

  const handleClose = () => {
    handleModalCardClose();
    setShowFloatingButtons(true);
  };

  return (
    <FlexGapped
      className={twMerge(
        'flex-col',
        !inPreview &&
          !inMissing &&
          !inSearch &&
          !isMobile &&
          'sticky bg-bgPrimary dark:bg-bgPrimaryDark sm:top-10',
      )}
    >
      <div>
        <DeckCryptHeader
          cards={crypt}
          cryptGroups={cryptGroups}
          cryptTotal={cryptTotal}
          deckid={deck[DECKID]}
          hasBanned={hasBanned}
          hasIllegalDate={hasIllegalDate}
          hasLimited={hasLimited}
          hasPlaytest={hasPlaytest}
          hasWrongGroups={hasWrongGroups}
          inMissing={inMissing}
          isEditable={isEditable}
          setShowInfo={setShowInfo}
          setSortMethod={changeCryptDeckSort}
          showInfo={showInfo}
          sortMethod={cryptDeckSort}
          sortMethods={sortMethods}
        />
        <DeckCryptTable
          deck={deck}
          handleClick={handleClick}
          cards={sortedCards}
          cryptTotal={cryptTotal}
          showInfo={showInfo}
          disciplinesSet={disciplinesSet}
          keyDisciplines={keyDisciplines}
          inSearch={inSearch}
          inMissing={inMissing}
          noDisciplines={noDisciplines}
          shouldShowModal={shouldShowModal}
        />
      </div>
      {Object.keys(cryptSide).length > 0 && (
        <div className="opacity-60 dark:opacity-50">
          <div className="flex h-[42px] items-center bg-bgSecondary p-2 font-bold dark:bg-bgSecondaryDark">
            Side Crypt
          </div>
          <DeckCryptTable
            deck={deck}
            handleClick={handleClickSide}
            cards={sortedCardsSide}
            disciplinesSet={disciplinesSet}
            showInfo={showInfo}
            keyDisciplines={keyDisciplines}
            noDisciplines={noDisciplines}
            inSearch={inSearch}
            inMissing={inMissing}
            shouldShowModal={shouldShowModal}
            inSide
          />
        </div>
      )}
      {shouldShowModal && (
        <ResultModal
          card={currentModalCard}
          handleModalCardChange={handleModalCardChange}
          handleClose={handleClose}
        />
      )}
    </FlexGapped>
  );
};

export default DeckCrypt;
