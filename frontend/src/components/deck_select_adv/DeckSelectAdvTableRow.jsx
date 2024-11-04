import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import EyeFill from '@/assets/images/icons/eye-fill.svg?react';
import Shuffle from '@/assets/images/icons/shuffle.svg?react';
import PinAngleFill from '@/assets/images/icons/pin-angle-fill.svg?react';
import At from '@/assets/images/icons/at.svg?react';
import {
  DeckPreview,
  DeckTags,
  DeckDeleteButton,
  DeckHideButton,
  DeckFreezeButton,
  DeckBranchDeleteButton,
  DeckCopyUrlButton,
  DeckPublicToggleButton,
  ResultClanImage,
  Tooltip,
  Button,
  Checkbox,
  ResultLegalIcon,
} from '@/components';
import { limitedStore, useApp, deckToggleInventoryState } from '@/context';
import { INVENTORY_TYPE, BANNED, LEGAL, PLAYTEST } from '@/utils/constants';
import { getClan, getRestrictions } from '@/utils';

const DeckSelectAdvTableRow = ({
  deck,
  onClick,
  handleClose,
  allTagsOptions,
  selectedDecks,
  toggleSelect,
  revFilter,
  short,
}) => {
  const { limitedMode, inventoryMode, isMobile, isNarrow, isDesktop } = useApp();
  const limitedCards = useSnapshot(limitedStore);
  const navigate = useNavigate();
  const [showDeck, setShowDeck] = useState();

  const { hasBanned, hasLimited, hasPlaytest, hasIllegalDate } = getRestrictions(
    deck,
    limitedCards,
  );

  const handleClick = () => {
    if (onClick) {
      onClick(deck);
    } else {
      navigate(`/decks/${deck.deckid}`);
    }
    handleClose();
  };

  const clan = getClan(deck.crypt);

  return (
    <tr className="row-bg h-[41px] border-y border-bgSecondary dark:border-bgSecondaryDark">
      {!(short || isMobile) && (
        <td className="min-w-[30px]">
          <Checkbox
            checked={selectedDecks[deck.deckid] ?? false}
            onChange={() => toggleSelect(deck.deckid)}
            className="justify-center"
          />
        </td>
      )}
      {inventoryMode && !isMobile && (
        <td>
          <div className="flex justify-center">
            <Button
              disabled={deck.isFrozen}
              onClick={() => deckToggleInventoryState(deck.deckid)}
              title={
                deck[INVENTORY_TYPE] === 's'
                  ? 'Flexible'
                  : deck[INVENTORY_TYPE] === 'h'
                    ? 'Fixed'
                    : 'Virtual'
              }
            >
              {deck[INVENTORY_TYPE] == 's' ? (
                <Shuffle />
              ) : deck[INVENTORY_TYPE] == 'h' ? (
                <PinAngleFill />
              ) : (
                <At />
              )}
            </Button>
          </div>
        </td>
      )}
      {(short || !isMobile) && (
        <td className="min-w-[60px] sm:min-w-[70px]" onClick={handleClick}>
          <div className="flex justify-center">{clan && <ResultClanImage value={clan} />}</div>
        </td>
      )}

      <td
        className={twMerge(short ? 'w-full' : 'min-w-[45vw]', 'cursor-pointer sm:min-w-[340px]')}
        onClick={handleClick}
      >
        <div
          className="flex justify-between gap-2 text-fgName dark:text-fgNameDark"
          title={deck.name}
        >
          {deck.name}
          <div className="flex items-center justify-end gap-3">
            {hasBanned && <ResultLegalIcon type={BANNED} />}
            {limitedMode && hasLimited && <ResultLegalIcon />}
            {hasPlaytest && <ResultLegalIcon type={PLAYTEST} />}
            {hasIllegalDate && <ResultLegalIcon type={LEGAL} value={hasIllegalDate} />}
            {deck.branchName && (deck.master || (deck.branches && deck.branches.length > 0)) && (
              <div className="inline" title={deck.branchName}>
                {deck.branchName}
              </div>
            )}
          </div>
        </div>
      </td>
      {isDesktop && (
        <td className="min-w-[30px] sm:min-w-[45px]">
          <div
            className="flex justify-center"
            onMouseEnter={() => setShowDeck(deck.deckid)}
            onMouseLeave={() => setShowDeck(false)}
          >
            <Tooltip
              size="xl"
              show={showDeck === deck.deckid}
              overlay={<DeckPreview deck={deck} setShow={setShowDeck} />}
            >
              <EyeFill />
            </Tooltip>
          </div>
        </td>
      )}
      {(short || !isNarrow) && (
        <td
          className="min-w-[100px] cursor-pointer whitespace-nowrap text-center sm:min-w-[105px]"
          onClick={handleClick}
        >
          {new Date(deck.timestamp).toISOString().split('T')[0]}
        </td>
      )}
      {!short && (
        <>
          <td className="w-full">
            <DeckTags
              deck={deck}
              allTagsOptions={allTagsOptions}
              isBordered
              noAutotags={isMobile}
            />
          </td>
          <td>
            <div className="flex justify-end gap-1">
              <DeckHideButton deck={deck} />
              {!isMobile && <DeckFreezeButton deck={deck} />}
              {isDesktop && (
                <>
                  <DeckPublicToggleButton deck={deck} inAdv />
                  <DeckCopyUrlButton deck={deck} noText isAuthor />
                  {revFilter && (deck.master || (deck.branches && deck.branches.length > 0)) ? (
                    <DeckBranchDeleteButton noText deck={deck} />
                  ) : (
                    <DeckDeleteButton noText deck={deck} />
                  )}
                </>
              )}
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

export default DeckSelectAdvTableRow;
