import React, { useState } from 'react';
import EyeFill from '@icons/eye-fill.svg?react';
import Shuffle from '@icons/shuffle.svg?react';
import PinAngleFill from '@icons/pin-angle-fill.svg?react';
import At from '@icons/at.svg?react';
import {
  DeckPreview,
  DeckTags,
  InventoryDeckAddButton,
  InventoryDeckDeleteButton,
  ResultClanImage,
  Tooltip,
  Button,
} from '@/components';
import { getClan } from '@/utils';
import { useDeckInInventory } from '@/hooks';
import { useApp, deckToggleInventoryState } from '@/context';
import {
  BRANCHES,
  BRANCH_NAME,
  CRYPT,
  DECKID,
  H,
  INVENTORY_TYPE,
  MASTER,
  NAME,
  S,
  TIMESTAMP,
} from '@/constants';

const InventoryAddDeckRow = ({ deck, allTagsOptions }) => {
  const { isDesktop, isMobile } = useApp();
  const [showDeck, setShowDeck] = useState();
  const inInventory = useDeckInInventory(deck);
  const clan = getClan(deck[CRYPT]);

  return (
    <tr className="row-bg border-y border-bgSecondary dark:border-bgSecondaryDark">
      {!isMobile && (
        <td>
          <Button onClick={() => deckToggleInventoryState(deck[DECKID])}>
            <div
              title={
                deck[INVENTORY_TYPE] === S
                  ? 'Flexible'
                  : deck[INVENTORY_TYPE] === H
                    ? 'Fixed'
                    : 'Virtual'
              }
            >
              {deck[INVENTORY_TYPE] == S && <Shuffle />}
              {deck[INVENTORY_TYPE] == H && <PinAngleFill />}
              {!deck[INVENTORY_TYPE] && <At />}
            </div>
          </Button>
        </td>
      )}
      <td className="min-w-[50px]">
        <div className="flex justify-center">{clan && <ResultClanImage value={clan} />}</div>
      </td>
      <td className="max-sm:w-full sm:min-w-[250px] lg:min-w-[400px]">
        <div
          className="flex justify-between truncate text-fgName dark:text-fgNameDark"
          title={deck[NAME]}
        >
          {deck[NAME]}
          {deck[BRANCH_NAME] && (deck[MASTER] || (deck[BRANCHES] && deck[BRANCHES].length > 0)) && (
            <div className="inline" title={deck[BRANCH_NAME]}>
              {deck[BRANCH_NAME]}
            </div>
          )}
        </div>
      </td>
      {isDesktop && (
        <td className="min-w-[30px] sm:min-w-[45px]">
          <div
            className="flex justify-center"
            onMouseEnter={() => setShowDeck(deck[DECKID])}
            onMouseLeave={() => setShowDeck(false)}
          >
            <Tooltip
              size="xl"
              show={showDeck === deck[DECKID]}
              overlay={<DeckPreview deck={deck} setShow={setShowDeck} />}
            >
              <EyeFill />
            </Tooltip>
          </div>
        </td>
      )}
      {!isMobile && (
        <td className="min-w-[100px] whitespace-nowrap">
          {new Date(deck[TIMESTAMP]).toISOString().split('T')[0]}
        </td>
      )}
      {!isMobile && (
        <td className="w-full">
          <DeckTags deck={deck} allTagsOptions={allTagsOptions} isBordered noAutoTags />
        </td>
      )}
      <td className="min-w-[110px]">
        <div className="flex justify-end gap-1">
          <InventoryDeckAddButton deck={deck} inInventory={inInventory} />
          <InventoryDeckDeleteButton deck={deck} inInventory={inInventory} />
        </div>
      </td>
    </tr>
  );
};

export default InventoryAddDeckRow;
