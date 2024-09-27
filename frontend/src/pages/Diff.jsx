import React, { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { useParams } from 'react-router-dom';
import {
  ButtonFloatClose,
  ButtonFloatMenu,
  DeckNewCardFloating,
  DiffButtons,
  DiffCrypt,
  DiffLibrary,
  DiffSelect,
  ErrorMessage,
  FlexGapped,
  Modal,
} from '@/components';
import { useApp, deckStore, setDeck } from '@/context';
import { useDeck } from '@/hooks';
import { deckServices } from '@/services';
import { CRYPT, LIBRARY } from '@/utils/constants';

const Diff = () => {
  const {
    addRecentDeck,
    preconDecks,
    playtestMode,
    cryptCardBase,
    libraryCardBase,
    isMobile,
    showFloatingButtons,
    setShowFloatingButtons,
    showMenuButtons,
    setShowMenuButtons,
  } = useApp();
  const { deck, decks } = useSnapshot(deckStore);
  const { deckidFrom, deckidTo } = useParams();

  const [errorFrom, setErrorFrom] = useState(false);
  const [errorTo, setErrorTo] = useState(false);
  const [deckTo, setDeckTo] = useState();

  const { isPublic, isAuthor, isFrozen } = deck || {};
  const isEditable = isAuthor && !isPublic && !isFrozen;

  const getDeck = async (id, setD, setE) => {
    let deckData;
    try {
      deckData = await deckServices.getDeck(id);
    } catch (e) {
      switch (e.response.status) {
        case 400:
          setE('NO DECK WITH THIS ID');
          break;
        default:
          setE('CONNECTION PROBLEM');
      }
      setD(undefined);
      return;
    }

    setE(false);
    const cardsData = useDeck(deckData.cards, cryptCardBase, libraryCardBase);
    const d = {
      ...deckData,
      crypt: cardsData.crypt,
      library: cardsData.library,
      isBranches: !!(deckData.master || deckData.branches?.length > 0),
      isPublic: !!deckData.publicParent,
    };

    addRecentDeck(d);
    setD(d);
  };

  useEffect(() => {
    if (cryptCardBase && libraryCardBase && decks !== undefined) {
      if (deckidFrom && deck?.deckid != deckidFrom) {
        if (decks[deckidFrom]) {
          setDeck(decks[deckidFrom]);
        } else if (deckidFrom.includes(':')) {
          if (preconDecks?.[deckidFrom]) {
            setDeck(preconDecks[deckidFrom]);
          } else {
            setDeck(undefined);
            setErrorFrom('NO DECK WITH THIS ID');
          }
        } else {
          getDeck(deckidFrom, setDeck, setErrorFrom);
        }
      }
    }
  }, [deckidFrom, decks, preconDecks, cryptCardBase, libraryCardBase]);

  useEffect(() => {
    if (cryptCardBase && libraryCardBase && decks !== undefined) {
      if (deckidTo && deckTo?.deckid != deckidTo) {
        if (decks[deckidTo]) {
          setDeckTo(decks[deckidTo]);
        } else if (deckidTo.includes(':')) {
          if (preconDecks?.[deckidTo]) {
            setDeckTo(preconDecks[deckidTo]);
          } else {
            setDeckTo(undefined);
            setErrorTo('NO DECK WITH THIS ID');
          }
        } else {
          getDeck(deckidTo, setDeckTo, setErrorTo);
        }
      }
    }
  }, [deckidTo, decks, preconDecks, cryptCardBase, libraryCardBase]);

  useEffect(() => {
    if (deck) setErrorFrom(false);
  }, [deck?.deckid]);

  useEffect(() => {
    if (deckTo) setErrorTo(false);
  }, [deckTo?.deckid]);

  const handleClose = () => {
    setShowMenuButtons(false);
    setShowFloatingButtons(true);
  };

  return (
    <div className="deck-container mx-auto">
      <FlexGapped>
        <FlexGapped className="w-full flex-col lg:basis-10/12">
          <DiffSelect
            decks={decks}
            deck={deck}
            deckTo={deckTo}
            deckidFrom={deckidFrom}
            deckidTo={deckidTo}
          />
          {(errorFrom || errorTo) && (
            <div className="flex flex-row">
              <div className="w-full">
                {errorFrom && <ErrorMessage>NO DECK WITH THIS ID</ErrorMessage>}
              </div>
              <div className="w-full">
                {errorTo && <ErrorMessage>NO DECK WITH THIS ID</ErrorMessage>}
              </div>
            </div>
          )}

          {deck && deckTo && (
            <FlexGapped className="max-sm:flex-col">
              {playtestMode ||
              !(
                Object.keys(deck.crypt).some((cardid) => cardid > 210000) ||
                Object.keys(deck.library).some((cardid) => cardid > 110000)
              ) ? (
                <>
                  <div className="basis-full sm:basis-5/9">
                    <DiffCrypt deck={deck} cardsTo={deckTo.crypt} />
                  </div>
                  <div className="basis-full sm:basis-4/9">
                    <DiffLibrary deck={deck} cardsTo={deckTo.library} />
                  </div>
                </>
              ) : (
                <ErrorMessage>CONTAINS PLAYTEST CARDS</ErrorMessage>
              )}
            </FlexGapped>
          )}
        </FlexGapped>
        {!isMobile && (
          <div className="basis-2/12 max-lg:hidden">
            <div className="top-[77px] z-20 bg-bgPrimary dark:bg-bgPrimaryDark">
              <DiffButtons deckFrom={deck} deckTo={deckTo} />
            </div>
          </div>
        )}
      </FlexGapped>
      {isEditable && isMobile && showFloatingButtons && (
        <>
          <DeckNewCardFloating
            target={CRYPT}
            deckid={deck.deckid}
            cards={Object.values(deck.crypt)}
          />
          <DeckNewCardFloating
            target={LIBRARY}
            deckid={deck.deckid}
            cards={Object.value(deck.library)}
          />
        </>
      )}
      <div className="lg:hidden">
        <ButtonFloatMenu />
      </div>
      {showMenuButtons && (
        <Modal handleClose={handleClose} centered size="sm">
          <DiffButtons deckFrom={deck} deckTo={deckTo} />
          <div className="lg:hidden">
            <ButtonFloatClose handleClose={handleClose} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Diff;
