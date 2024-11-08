import React, { useState, useEffect } from 'react';
import { DeckDrawModal } from '@/components';
import { POOL, BLOOD } from '@/constants';
import { countCards, getCardsArray } from '@/utils';
import { useApp } from '@/context';
import { CRYPT, LIBRARY, CAPACITY } from '@/constants';

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomTransfers = () => {
  const t = [1, 2, 3, 4, 4];
  return t[getRandomInt(5)];
};

const DeckDraw = ({ deck, setShow }) => {
  const { setShowFloatingButtons } = useApp();

  const cryptTotal = countCards(Object.values(deck[CRYPT]));
  const cryptArr = getCardsArray(deck[CRYPT]);
  const libraryArr = getCardsArray(deck[LIBRARY]);

  const drawCards = (cards, quantity) => {
    const restArray = [...cards];
    const drawArray = [];

    while (quantity > 0) {
      const randomId = getRandomInt(restArray.length);
      drawArray.push(restArray[randomId]);
      restArray.splice(randomId, 1);
      quantity -= 1;
    }
    return [drawArray, restArray];
  };

  const [showDrawModal, setShowDrawModal] = useState(true);
  const [libraryHandSize, setLibraryHandSize] = useState(7);
  const [cryptHandSize, setCryptHandSize] = useState(4);
  const [restCrypt, setRestCrypt] = useState(cryptArr);
  const [restLibrary, setRestLibrary] = useState(libraryArr);
  const [drawedCrypt, setDrawedCrypt] = useState([]);
  const [drawedLibrary, setDrawedLibrary] = useState([]);
  const [burnedCrypt, setBurnedCrypt] = useState([]);
  const [burnedLibrary, setBurnedLibrary] = useState([]);
  const [initialTransfers, setInitialTransfers] = useState(getRandomTransfers());

  const handleCloseDrawModal = () => {
    setShowDrawModal(false);
    setShow(false);
    setShowFloatingButtons(true);
  };

  const handleReDrawCrypt = () => {
    setInitialTransfers(getRandomTransfers());
    setCryptHandSize(4);
    const [draw, rest] = drawCards(cryptArr, 4);
    setDrawedCrypt(draw);
    setRestCrypt(rest);
    setBurnedCrypt([]);
  };

  const handleReDrawLibrary = () => {
    setLibraryHandSize(7);
    const [draw, rest] = drawCards(libraryArr, 7);
    setDrawedLibrary(draw);
    setRestLibrary(rest);
    setBurnedLibrary([]);
  };

  const handleCryptHandSize = (q) => {
    setCryptHandSize(cryptHandSize + q);
  };

  const handleLibraryHandSize = (q) => {
    setLibraryHandSize(libraryHandSize + q);
  };

  const burnCrypt = (index) => {
    const hand = drawedCrypt;
    const burnedCard = hand.splice(index, 1)[0];
    setBurnedCrypt([burnedCard, ...burnedCrypt]);
    setDrawedCrypt(hand);
    setCryptHandSize(cryptHandSize - 1);
  };

  const burnLibrary = (index) => {
    const hand = drawedLibrary;
    const burnedCard = hand.splice(index, 1)[0];
    setBurnedLibrary([burnedCard, ...burnedLibrary]);
    let newDrawedCards = [];
    let newRestCards = [];
    if (restLibrary.length > 0) {
      [newDrawedCards, newRestCards] = drawCards(restLibrary, 1);
    } else {
      setLibraryHandSize(libraryHandSize - 1);
    }
    const allDrawedCards = [...hand, ...newDrawedCards];
    setDrawedLibrary(allDrawedCards);
    setRestLibrary(newRestCards);
  };

  let burnedCapacityTotal = 0;
  burnedCrypt.forEach((card) => {
    burnedCapacityTotal += parseInt(card[CAPACITY]);
  });

  let burnedPoolTotal = 0;
  let burnedBloodTotal = 0;

  burnedLibrary.forEach((card) => {
    if (card[BLOOD] && !isNaN(card[BLOOD])) {
      burnedBloodTotal += parseInt(card[BLOOD]);
    }
    if (card[POOL] && !isNaN(card[POOL])) {
      burnedPoolTotal += parseInt(card[POOL]);
    }
  });

  useEffect(() => {
    if (restCrypt) {
      if (drawedCrypt.length < cryptHandSize) {
        if (cryptHandSize - drawedCrypt.length <= restCrypt.length) {
          const diff = cryptHandSize - drawedCrypt.length;
          const [draw, rest] = drawCards(restCrypt, diff);
          setDrawedCrypt([...drawedCrypt, ...draw]);
          setRestCrypt(rest);
        }
      } else if (drawedCrypt.length > cryptHandSize) {
        const diff = drawedCrypt.length - cryptHandSize;
        const overhead = drawedCrypt.slice(-diff);
        setDrawedCrypt([...drawedCrypt.slice(0, drawedCrypt.length - diff)]);
        setRestCrypt([...restCrypt, ...overhead]);
      }
    }
  }, [restCrypt, cryptHandSize]);

  useEffect(() => {
    if (restLibrary) {
      if (drawedLibrary.length < libraryHandSize) {
        if (libraryHandSize - drawedLibrary.length <= restLibrary.length) {
          const diff = libraryHandSize - drawedLibrary.length;
          const [draw, rest] = drawCards(restLibrary, diff);
          setDrawedLibrary([...drawedLibrary, ...draw]);
          setRestLibrary(rest);
        }
      } else if (drawedLibrary.length > libraryHandSize) {
        const diff = drawedLibrary.length - libraryHandSize;
        const overhead = drawedLibrary.slice(-diff);
        setDrawedLibrary([...drawedLibrary.slice(0, drawedLibrary.length - diff)]);
        setRestLibrary([...restLibrary, ...overhead]);
      }
    }
  }, [restLibrary, libraryHandSize]);

  return (
    <>
      {showDrawModal && (
        <DeckDrawModal
          burnCrypt={burnCrypt}
          burnLibrary={burnLibrary}
          burnedBloodTotal={burnedBloodTotal}
          burnedCapacityTotal={burnedCapacityTotal}
          burnedCrypt={burnedCrypt}
          burnedLibrary={burnedLibrary}
          burnedPoolTotal={burnedPoolTotal}
          crypt={deck[CRYPT]}
          cryptTotal={cryptTotal}
          drawedCrypt={drawedCrypt}
          drawedLibrary={drawedLibrary}
          handleClose={handleCloseDrawModal}
          handleCryptHandSize={handleCryptHandSize}
          handleLibraryHandSize={handleLibraryHandSize}
          handleReDrawCrypt={handleReDrawCrypt}
          handleReDrawLibrary={handleReDrawLibrary}
          initialTransfers={initialTransfers}
          libraryTotal={libraryArr.length}
          restCrypt={restCrypt}
          restLibrary={restLibrary}
        />
      )}
    </>
  );
};

export default DeckDraw;
