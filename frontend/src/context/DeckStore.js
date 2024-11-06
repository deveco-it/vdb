import { proxy } from 'valtio';
import { deepClone } from '@/utils';
import {
  USED_IN_INVENTORY,
  CRYPT,
  LIBRARY,
  DECK,
  DECKS,
  CRYPT_TIMER,
  TEXT,
  CARDS,
  INVENTORY_TYPE,
  AUTHOR,
  S,
  H,
} from '@/constants';
import { deckServices } from '@/services';
import { startCryptTimer, miscStore } from '@/context';

export const deckStore = proxy({
  [DECK]: undefined,
  [DECKS]: undefined,
});

export const setDeck = (v) => {
  deckStore[DECK] = deepClone(v);
  miscStore[CRYPT_TIMER] = !miscStore[CRYPT_TIMER];
};

export const deckCardChange = (deckid, card, q) => {
  const cardSrc = card[ID] > 200000 ? CRYPT : LIBRARY;
  const initialDeckState = deepClone(deckStore[DECK]);
  const initialDecksState = deepClone(deckStore[DECKS][deckid]);

  if (q >= 0) {
    deckStore[DECKS][deckid][cardSrc][card[ID]] = {
      c: card,
      q: q,
    };

    if (deckid === deckStore[DECK][DECKID]) {
      deckStore[DECK][cardSrc][card[ID]] = {
        c: card,
        q: q,
      };
    }
  } else {
    delete deckStore[DECKS][deckid][cardSrc][card[ID]];

    if (deckid === deckStore[DECK][DECKID]) {
      delete deckStore[DECK][cardSrc][card[ID]];
    }
  }

  changeMaster(deckid);

  if (cardSrc === CRYPT) startCryptTimer();

  deckServices.cardChange(deckid, card[ID], q).catch(() => {
    deckStore[DECK] = initialDeckState;
    deckStore[DECKS][deckid] = initialDecksState;
  });
};

export const deckUpdate = (deckid, field, value) => {
  let initialDeckState;
  if (deckStore?.deck?.[DECKID] === deckid) {
    initialDeckState = deepClone(deckStore[DECK]);
  }
  const initialDecksState = deepClone(deckStore[DECKS][deckid]);

  switch (field) {
    case USED_IN_INVENTORY:
      Object.keys(value).forEach((cardid) => {
        if (cardid > 200000) {
          deckStore[DECKS][deckid][CRYPT][cardid].i = value[cardid];
        } else {
          deckStore[DECKS][deckid][LIBRARY][cardid].i = value[cardid];
        }
      });

      if (deckid === deckStore?.deck?.[DECKID]) {
        Object.keys(value).forEach((cardid) => {
          if (cardid > 200000) {
            deckStore[DECK][CRYPT][cardid].i = value[cardid];
          } else {
            deckStore[DECK][LIBRARY][cardid].i = value[cardid];
          }
        });
      }
      break;
    case CARDS:
      deckStore[DECKS][deckid][CRYPT] = value[CRYPT];
      deckStore[DECKS][deckid][LIBRARY] = value[LIBRARY];

      if (deckid === deckStore?.deck?.[DECKID]) {
        deckStore[DECK][CRYPT] = value[CRYPT];
        deckStore[DECK][LIBRARY] = value[LIBRARY];
      }
      break;
    default:
      deckStore[DECKS][deckid][field] = value;
      if (field === INVENTORY_TYPE) {
        Object.keys(deckStore[DECKS][deckid][CRYPT]).forEach((cardid) => {
          deckStore[DECKS][deckid][CRYPT][cardid].i = '';
        });
        Object.keys(deckStore[DECKS][deckid][LIBRARY]).forEach((cardid) => {
          deckStore[DECKS][deckid][LIBRARY][cardid].i = '';
        });
      }

      if (deckid === deckStore?.deck?.[DECKID]) {
        deckStore[DECK][field] = value;
        if (field === INVENTORY_TYPE) {
          Object.keys(deckStore[DECK][CRYPT]).forEach((cardid) => {
            deckStore[DECK][CRYPT][cardid].i = '';
          });
          Object.keys(deckStore[DECK][LIBRARY]).forEach((cardid) => {
            deckStore[DECK][LIBRARY][cardid].i = '';
          });
        }
      }
  }

  const branchesUpdateFields = [NAME, AUTHOR];
  if (
    branchesUpdateFields.includes(field) &&
    (deckStore[DECKS][deckid][BRANCHES] || deckStore[DECKS][deckid][MASTER])
  ) {
    branchesUpdate(deckid, field, value);
  }
  changeMaster(deckid);

  if (field === CARDS) {
    const cards = {};
    Object.values({ ...value[CRYPT], ...value[LIBRARY] }).forEach((card) => {
      cards[card.c[ID]] = card.q;
    });
    value = cards;
  }

  const now = new Date();
  deckStore[DECKS][deckid][TIMESTAMP] = now.toUTCString();

  return deckServices.update(deckid, field, value).catch(() => {
    deckStore[DECK] = initialDeckState;
    deckStore[DECKS][deckid] = initialDecksState;
  });
};

export const deckToggleInventoryState = (deckid) => {
  switch (deckStore[DECKS][deckid][INVENTORY_TYPE]) {
    case S:
      deckUpdate(deckid, INVENTORY_TYPE, H);
      break;
    case H:
      deckUpdate(deckid, INVENTORY_TYPE, '');
      break;
    default:
      deckUpdate(deckid, INVENTORY_TYPE, S);
  }
};

export const cardToggleInventoryState = (deckid, cardid) => {
  const deck = deckStore[DECKS][deckid];
  const target = cardid > 200000 ? CRYPT : LIBRARY;
  const value = deck[target][cardid].i ? '' : deck[INVENTORY_TYPE] === S ? H : S;
  deckUpdate(deckid, USED_IN_INVENTORY, {
    [cardid]: value,
  });
};

export const deckAdd = (deck) => {
  const now = new Date();
  const d = {
    deckid: deck[DECKID],
    name: deck[NAME] ?? '',
    master: deck[MASTER] ?? null,
    branches: deck[BRANCHES] ?? [],
    branchName: deck[BRANCH_NAME] ?? '#0',
    description: deck[DESCRIPTION] ?? '',
    author: deck[AUTHOR] ?? '',
    crypt: deck[CRYPT],
    library: deck[LIBRARY],
    timestamp: now.toUTCString(),
    isAuthor: true,
    isPublic: Boolean(deck.publicParent),
    isBranches: Boolean(deck[MASTER] || deck[BRANCHES]?.length > 0),
  };

  deckStore[DECKS][deck[DECKID]] = d;
};

export const deckLocalize = (localizedCrypt, nativeCrypt, localizedLibrary, nativeLibrary) => {
  Object.values(deckStore[DECK][CRYPT]).forEach((card) => {
    const id = card.c[ID];
    const newInfo = localizedCrypt[id] ? localizedCrypt[id] : nativeCrypt[id];
    deckStore[DECK][CRYPT][id].c[NAME] = newInfo[NAME];
    deckStore[DECK][CRYPT][id].c[TEXT] = newInfo[TEXT];
  });
  Object.values(deckStore[DECK][LIBRARY]).forEach((card) => {
    const id = card.c[ID];
    const newInfo = localizedLibrary[id] ? localizedLibrary[id] : nativeLibrary[id];
    deckStore[DECK][LIBRARY][id].c[NAME] = newInfo[NAME];
    deckStore[DECK][LIBRARY][id].c[TEXT] = newInfo[TEXT];
  });
};

// INTERNAL STORE FUNCTIONS
const changeMaster = (deckid) => {
  const oldMasterDeckid = deckStore[DECKS][deckid][MASTER];

  if (oldMasterDeckid) {
    const branches = deckStore[DECKS][oldMasterDeckid][BRANCHES].filter((i) => i !== deckid);
    branches.push(oldMasterDeckid);

    branches.forEach((b) => {
      deckStore[DECKS][b][MASTER] = deckid;
      deckStore[DECKS][b][BRANCHES] = [];
    });
    deckStore[DECKS][deckid][BRANCHES] = branches;
    deckStore[DECKS][deckid][MASTER] = null;

    deckStore[DECK][BRANCHES] = branches;
    deckStore[DECK][MASTER] = null;
  }
};

const branchesUpdate = (deckid, field, value) => {
  let revisions = [];
  if (deckStore[DECKS][deckid][MASTER]) {
    revisions = [
      deckStore[DECKS][deckid][MASTER],
      ...deckStore[DECKS][deckStore[DECKS][deckid][MASTER]][BRANCHES],
    ];
  } else {
    revisions = [deckid, ...deckStore[DECKS][deckid][BRANCHES]];
  }

  revisions.forEach((d) => {
    deckStore[DECKS][d][field] = value;
  });
};
