import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { FlexGapped, DiffCryptTable, ResultModal, DeckCryptHeader } from '@/components';
import { useApp } from '@/context';
import { useModalCardController, useDeckCrypt } from '@/hooks';
import { getKeyDisciplines } from '@/utils';
import { CAPACITY, CLAN, GROUP, NAME, QUANTITYx, SECT } from '@/constants';

const ReviewCrypt = ({ cardChange, cardsFrom, cardsTo }) => {
  const { cryptDeckSort, changeCryptDeckSort, isMobile } = useApp();
  const [showInfo, setShowInfo] = useState(false);

  const sortMethods = {
    [CAPACITY]: 'C',
    [CLAN]: 'CL',
    [GROUP]: 'G',
    [NAME]: 'N',
    [QUANTITYx]: 'Q',
    [SECT]: 'S',
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
  } = useDeckCrypt(cardsFrom, cryptDeckSort, cardsTo);

  const { disciplinesSet, keyDisciplines } = getKeyDisciplines(crypt);

  const {
    currentModalCard,
    shouldShowModal,
    handleModalCardOpen,
    handleModalSideCardOpen,
    handleModalCardChange,
    handleModalCardClose,
  } = useModalCardController(sortedCards, sortedCardsSide);

  return (
    <FlexGapped
      className={twMerge(
        'flex-col',
        !isMobile && 'sticky bg-bgPrimary dark:bg-bgPrimaryDark sm:top-10',
      )}
    >
      <div>
        <DeckCryptHeader
          cardChange={cardChange}
          cards={crypt}
          cryptGroups={cryptGroups}
          cryptTotal={cryptTotal}
          hasBanned={hasBanned}
          hasIllegalDate={hasIllegalDate}
          hasLimited={hasLimited}
          hasPlaytest={hasPlaytest}
          hasWrongGroups={hasWrongGroups}
          isEditable
          setShowInfo={setShowInfo}
          setSortMethod={changeCryptDeckSort}
          showInfo={showInfo}
          sortMethod={cryptDeckSort}
          sortMethods={sortMethods}
        />
        <DiffCryptTable
          isEditable
          cardChange={cardChange}
          handleModalCardOpen={handleModalCardOpen}
          cards={sortedCards}
          cardsFrom={cardsFrom}
          cardsTo={cardsTo}
          showInfo={showInfo}
          cryptTotal={cryptTotal}
          disciplinesSet={disciplinesSet}
          keyDisciplines={keyDisciplines}
        />
      </div>
      {Object.keys(cryptSide).length > 0 && (
        <div className="opacity-60 dark:opacity-50">
          <div className="flex items-center justify-between font-bold">Side Crypt</div>
          <DiffCryptTable
            isEditable
            cardChange={cardChange}
            handleModalCardOpen={handleModalSideCardOpen}
            cards={sortedCardsSide}
            cardsFrom={cardsFrom}
            cardsTo={cardsTo}
            disciplinesSet={disciplinesSet}
            keyDisciplines={keyDisciplines}
          />
        </div>
      )}
      {shouldShowModal && (
        <ResultModal
          card={currentModalCard}
          handleModalCardChange={handleModalCardChange}
          handleClose={handleModalCardClose}
        />
      )}
    </FlexGapped>
  );
};

export default ReviewCrypt;
