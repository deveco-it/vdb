import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';
import Check2 from '@/assets/images/icons/check2.svg?react';
import {
  DeckSelectMy,
  DeckBranchSelect,
  DeckSelectPrecon,
  DeckSelectRecent,
  Button,
  Radio,
  Input,
} from '@/components';
import { useApp } from '@/context';
import { IS_BRANCHES, DECKID, ID, FROM } from '@/constants';

const DiffSelectDeck = ({ decks, deck, deckidFrom, deckidTo, target, title }) => {
  const { recentDecks, inventoryMode, username, isMobile } = useApp();
  const deckid = target === FROM ? deckidFrom : deckidTo;
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('from-my');

  const handleSelect = (e) => {
    if (target == FROM) {
      navigate(`/diff/${e.value}/${deckidTo}`);
    } else {
      navigate(`/diff/${deckidFrom}/${e.value}`);
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const newId = url.replace(`${import.meta.env.VITE_BASE_URL}/decks/`, '');

    if (target === FROM) {
      navigate(`/diff/${newId}/${deckidTo}`);
    } else {
      navigate(`/diff/${deckidFrom}/${newId}`);
    }
  };

  useEffect(() => {
    if (deckid?.includes(':')) {
      setSource(`${target}-precons`);
    } else if (decks?.[deckid]) {
      setSource(`${target}-my`);
    } else {
      setSource(`${target}-recent`);
    }
  }, [deckid, decks]);

  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">{title}</div>
      {source === `${target}-url` ? (
        <form name={target} onSubmit={handleUrlSubmit} className="min-w-[270px]">
          <div className="flex">
            <Input
              roundedStyle="rounded rounded-r-none"
              placeholder="First Deck (ID or URL)"
              name={target}
              value={url}
              onChange={handleUrlChange}
            />
            <Button className="rounded-l-none" type="submit">
              <Check2 />
            </Button>
          </div>
        </form>
      ) : (
        <div
          className={twMerge('z-20 flex gap-1', !inventoryMode && isMobile && 'justify-between')}
        >
          <div className={deck?.[IS_BRANCHES] && source == `${target}-my` ? 'w-3/4' : 'w-full'}>
            {source == `${target}-my` && decks ? (
              <DeckSelectMy handleSelect={handleSelect} deckid={deck?.[DECKID]} />
            ) : source == `${target}-recent` ? (
              <DeckSelectRecent handleSelect={handleSelect} deckid={deck?.[DECKID]} />
            ) : (
              <DeckSelectPrecon handleSelect={handleSelect} deckid={deck?.[DECKID]} />
            )}
          </div>
          {source == `${target}-my` && decks && deck?.[IS_BRANCHES] && (
            <div className="w-1/4">
              <DeckBranchSelect handleSelect={handleSelect} deck={deck} />
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-6">
        <div className="flex gap-6">
          {username && decks && Object.keys(decks).length > 0 && (
            <Radio
              checked={source == `${target}-my`}
              onChange={(e) => setSource(e.target[ID])}
              id={`${target}-my`}
              value={isMobile ? 'My' : 'My Decks'}
            />
          )}
          <Radio
            checked={source == `${target}-precons`}
            onChange={(e) => setSource(e.target[ID])}
            id={`${target}-precons`}
            value="Precons"
          />
          {recentDecks.length > 0 && (
            <Radio
              checked={source == `${target}-recent`}
              onChange={(e) => setSource(e.target[ID])}
              id={`${target}-recent`}
              value="Recent"
            />
          )}
          <Radio
            checked={source == `${target}-url`}
            onChange={(e) => setSource(e.target[ID])}
            id={`${target}-url`}
            value="URL"
          />
        </div>
      </div>
    </div>
  );
};

export default DiffSelectDeck;
