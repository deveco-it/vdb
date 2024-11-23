import React, { useState } from 'react';
import InfoCircle from '@/assets/images/icons/info-circle.svg?react';
import PlusLg from '@/assets/images/icons/plus-lg.svg?react';
import { DeckCryptTotalInfo, DeckNewCard, Warning, Button, SortButton, Header } from '@/components';
import { useApp } from '@/context';
import { getKeyDisciplines } from '@/utils';
import { CRYPT, GROUPS, LIMITED, BANNED, LEGAL, PLAYTEST } from '@/constants';

const DeckCryptHeader = ({
  cardChange,
  cards,
  cryptGroups,
  cryptTotal,
  deckid,
  hasBanned,
  hasIllegalDate,
  hasLimited,
  hasPlaytest,
  hasWrongGroups,
  inMissing,
  isEditable,
  setShowInfo,
  setSortMethod,
  showInfo,
  sortMethod,
  sortMethods,
}) => {
  const { limitedMode, isMobile } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const { disciplinesDetailed } = getKeyDisciplines(cards);

  return (
    <>
      <Header>
        <div className="flex basis-full justify-between">
          <div className="flex basis-full items-center justify-between gap-2 px-2 font-bold">
            <div className="flex">
              Crypt [{cryptTotal}
              {!inMissing && cryptTotal < 12 && ' of 12+'}] {cryptGroups && <>G{cryptGroups}</>}
            </div>
            <div className="flex gap-2">
              {!inMissing && (
                <>
                  {hasWrongGroups && <Warning type={GROUPS} />}
                  {hasBanned && <Warning type={BANNED} />}
                  {limitedMode && hasLimited && <Warning type={LIMITED} />}
                  {hasPlaytest && <Warning type={PLAYTEST} />}
                  {hasIllegalDate && <Warning value={hasIllegalDate} type={LEGAL} />}
                </>
              )}
            </div>
            <div />
          </div>
          <div className="flex min-h-10 items-center gap-1">
            {!inMissing && (
              <SortButton
                className="min-h-10"
                sortMethods={sortMethods}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
              />
            )}
            <Button
              className="min-h-10"
              title="Additional Info"
              onClick={() => setShowInfo(!showInfo)}
            >
              <InfoCircle />
            </Button>
            {isEditable && !isMobile && (
              <Button className="min-h-10" title="Add Card" onClick={() => setShowAdd(!showAdd)}>
                <PlusLg width="15" height="15" viewBox="0 0 16 16" />
              </Button>
            )}
          </div>
        </div>
      </Header>
      {showInfo && <DeckCryptTotalInfo disciplinesDetailed={disciplinesDetailed} cards={cards} />}
      {showAdd && (
        <DeckNewCard
          handleClose={() => setShowAdd(false)}
          cards={cards}
          deckid={deckid}
          target={CRYPT}
          cardChange={cardChange}
        />
      )}
    </>
  );
};

export default DeckCryptHeader;
