import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { SeatingModal } from '@/components';
import { getLocalStorage, setLocalStorage } from '@/services/storageServices';
import { useApp } from '@/context';
import standardDecksData from '@/assets/data/standardDecks.json';

const CUSTOM_DECKS = 'seatingCustomDecks';
const STANDARD_DECKS = 'seatingStandardDecks';
const WITH_CUSTOM = 'seatingWithCustom';
const WITH_STANDARD = 'seatingWithStandard';
const PLAYERS = 'seatingPlayers';

const getRandomDeck = (players) => {
  return players[Math.floor(Math.random() * Math.floor(players.length))];
};

const randomizeArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Seating = ({ setShow }) => {
  const { setShowFloatingButtons } = useApp();
  const [seating, setSeating] = useState();
  const [withCustom, setWithCustom] = useState(getLocalStorage(WITH_CUSTOM) ?? true);
  const [withStandard, setWithStandard] = useState(getLocalStorage(WITH_STANDARD) ?? true);
  const [customDecks, setCustomDecks] = useImmer(getLocalStorage(CUSTOM_DECKS) ?? []);
  const [standardDecks, setStandardDecks] = useImmer(
    getLocalStorage(STANDARD_DECKS) ??
      Object.keys(standardDecksData)
        .toSorted((a, b) => standardDecksData[a].localeCompare(standardDecksData[b], 'en'))
        .map((deckid) => ({
          deckid: deckid,
          name: standardDecksData[deckid],
          state: true,
        })),
  );
  const [players, setPlayers] = useImmer(
    getLocalStorage(PLAYERS) ?? [
      { name: 'Player 1', random: false, state: true },
      { name: 'Player 2', random: false, state: true },
      { name: 'Player 3', random: false, state: true },
      { name: 'Player 4', random: false, state: true },
      { name: 'Player 5', random: false, state: true },
    ],
  );

  const setPlayer = (i, value) => {
    setPlayers((draft) => {
      draft[i] = value;
    });
  };

  const addPlayer = () => {
    setPlayers((draft) => {
      draft.push({
        name: `Player ${draft.length + 1}`,
        random: false,
        state: true,
      });
    });
  };

  const delPlayer = (i) => {
    setPlayers((draft) => {
      draft.splice(i, 1);
    });
  };

  const handleCloseModal = () => {
    setShow(false);
    setShowFloatingButtons(true);
  };

  const reshuffle = () => {
    const options = players
      .filter((d) => d.state)
      .map((d) => {
        if (d.random) {
          const src = [];
          if (withCustom) src.push(...customDecks.filter((v) => v.state));
          if (withStandard) src.push(...standardDecks.filter((v) => v.state));
          if (!src.length > 0) return { name: 'ERROR', deckid: null };
          const randomDeck = getRandomDeck(src);
          return { name: randomDeck[NAME], deckid: randomDeck.deckid };
        } else {
          return { name: d[NAME] };
        }
      });

    if ([7, 11].includes(options.length)) {
      options.push({ name: 'First oust from another table' });
    }

    const randomizedPlayers = randomizeArray(options);
    const tablesWithQty = getTablesWithQty(randomizedPlayers.length);
    const tablesWithPlayers = [];
    tablesWithQty.map((n) => {
      tablesWithPlayers.push(randomizedPlayers.slice(0, n));
      randomizedPlayers.splice(0, n);
    });

    setSeating(tablesWithPlayers);
  };

  const getTablesWithQty = (q) => {
    const fullTablesQty = Math.floor(q / 5);

    switch (q) {
      case 3:
        return [3];
      case 6:
        return [6];
    }

    let tables;
    switch (q % 5) {
      case 0:
        tables = Array(fullTablesQty).fill(5);
        break;
      case 1:
        tables = Array(fullTablesQty + 1).fill(5);
        tables.fill(4, tables.length - 4);
        break;
      case 2:
        tables = Array(fullTablesQty + 1).fill(5);
        tables.fill(4, tables.length - 3);
        break;
      case 3:
        tables = Array(fullTablesQty + 1).fill(5);
        tables.fill(4, tables.length - 2);
        break;
      case 4:
        tables = Array(fullTablesQty + 1).fill(5);
        tables.fill(4, tables.length - 1);
        break;
    }

    return tables;
  };

  const toggleCustom = (i) => {
    setCustomDecks((draft) => {
      draft[i].state = !draft[i].state;
    });
  };

  const toggleStandard = (i) => {
    setStandardDecks((draft) => {
      draft[i].state = !draft[i].state;
    });
  };

  const addCustomDeck = (name) => {
    setCustomDecks((draft) => {
      draft.unshift({ deckid: null, name: name, state: true });
    });
  };

  const removeCustomDeck = (i) => {
    setCustomDecks((draft) => {
      draft.splice(i, 1);
    });
  };

  useEffect(() => {
    setLocalStorage(CUSTOM_DECKS, customDecks);
    setLocalStorage(PLAYERS, players);
    setLocalStorage(STANDARD_DECKS, standardDecks);
    setLocalStorage(WITH_CUSTOM, withCustom);
    setLocalStorage(WITH_STANDARD, withStandard);
  }, [customDecks, standardDecks, withCustom, withStandard, players]);

  return (
    <SeatingModal
      addCustomDeck={addCustomDeck}
      removeCustomDeck={removeCustomDeck}
      customDecks={customDecks}
      handleClose={handleCloseModal}
      players={players}
      reshuffle={reshuffle}
      seating={seating}
      setPlayer={setPlayer}
      delPlayer={delPlayer}
      addPlayer={addPlayer}
      setWithCustom={setWithCustom}
      setWithStandard={setWithStandard}
      standardDecks={standardDecks}
      toggleCustom={toggleCustom}
      toggleStandard={toggleStandard}
      withCustom={withCustom}
      withStandard={withStandard}
    />
  );
};

export default Seating;
