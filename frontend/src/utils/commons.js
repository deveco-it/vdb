import {
  ANY,
  BANNED,
  CLAN,
  CRYPT,
  DATE,
  DISCIPLINES,
  GROUP,
  ID,
  IS_AUTHOR,
  IS_FROZEN,
  IS_NON_EDITABLE,
  IS_PUBLIC,
  LIBRARY,
  NAME,
  PLAYTEST,
  POD,
  PROMO,
  SECT,
  SET,
} from '@/constants';
import setsAndPrecons from '@/assets/data/setsAndPrecons.json';
import disciplinesList from '@/assets/data/disciplinesList.json';
import virtuesList from '@/assets/data/virtuesList.json';

export const getCardProperty = (card, property) => {
  return card.c ? card.c[property] : card[property];
};

export const initialize = (array, index, value) => {
  if (array[index] === null || array[index] === undefined) {
    array[index] = value;
  }
};

export const countCards = (cardsList) => {
  if (!cardsList.length) return 0;
  return cardsList.reduce((acc, card) => acc + card.q, 0);
};

export const countDisciplines = (cardsList) => {
  if (!cardsList.length) return 0;
  return cardsList.reduce((acc, card) => {
    const n = card.c
      ? Object.keys(card.c[DISCIPLINES]).length
      : Object.keys(card[DISCIPLINES]).length;
    if (acc > n) return acc;
    return n;
  });
};

export const countTotalCost = (cardsList, type) => {
  if (!cardsList.length) return 0;
  return cardsList
    .filter((card) => !isNaN(card.c[type]))
    .reduce((acc, card) => acc + card.q * card.c[type], 0);
};

export const getRestrictions = (deck, limitedCards) => {
  let hasPlaytest;
  let hasIllegalDate;
  let hasBanned;
  let hasLimited;
  [...Object.values(deck[CRYPT]), ...Object.values(deck[LIBRARY])].forEach((card) => {
    if (card.q < 1) return;
    if (card.c[BANNED]) hasBanned = true;
    if (
      limitedCards &&
      ![...Object.keys(limitedCards[CRYPT]), ...Object.keys(limitedCards[LIBRARY])].includes(
        card.c[ID],
      )
    ) {
      hasLimited = true;
    }

    const legalRestriction = getLegality(card.c);
    if (legalRestriction && legalRestriction === PLAYTEST) {
      hasPlaytest = true;
    }
    if (legalRestriction && legalRestriction !== PLAYTEST) {
      hasIllegalDate = legalRestriction;
    }
  });

  return {
    hasBanned: hasBanned,
    hasLimited: hasLimited,
    hasPlaytest: hasPlaytest,
    hasIllegalDate: hasIllegalDate,
  };
};

export const getLegality = (card) => {
  const sets = Object.keys(card[SET]).filter((s) => s !== PLAYTEST);
  if (sets.length > 1 || [POD, PROMO].includes(sets[0])) return false;
  if (sets.length == 0) return PLAYTEST;

  const MS_TO_DAYS = 1000 * 60 * 60 * 24;
  const setDate = new Date(setsAndPrecons[sets[0]][DATE]);
  const now = new Date();
  if ((now - setDate) / MS_TO_DAYS > 30) return false;
  setDate.setDate(setDate.getDate() + 30);
  const dateIso = setDate.toISOString().split('T')[0];
  return dateIso;
};

export const getGroups = (cards) => {
  const cryptGroupMin = cards
    .filter((card) => card.c[GROUP] !== ANY)
    .reduce((acc, card) => (acc = card.c[GROUP] < acc ? card.c[GROUP] : acc), 10);

  const cryptGroupMax = cards
    .filter((card) => card.c[GROUP] !== ANY)
    .reduce((acc, card) => (acc = card.c[GROUP] > acc ? card.c[GROUP] : acc), 0);

  if (cryptGroupMax - cryptGroupMin == 1) {
    return { cryptGroups: `${cryptGroupMin}-${cryptGroupMax}` };
  } else if (cryptGroupMax - cryptGroupMin == 0) {
    return { cryptGroups: cryptGroupMax };
  }

  return { hasWrongGroups: true };
};

export const getTotalCardsGroupedBy = (cards, property) => {
  const groupedCards = Object.groupBy(cards, (card) => {
    return card.c[property];
  });
  const resultObject = {};
  Object.entries(groupedCards).forEach(([k, v]) => {
    resultObject[k] = countCards(v);
  });
  return resultObject;
};

export const getCardsGroupedBy = (cards, property) => {
  return Object.groupBy(cards, (card) => card.c[property]);
};

export const containCard = (cards, card) => {
  return cards.map((c) => getCardProperty(c, ID)).includes(getCardProperty(card, ID));
};

export const getHardTotal = (hardList) => {
  if (!hardList) return 0;

  return Object.values(hardList).reduce((acc, q) => (acc += q), 0);
};

export const getSoftMax = (softList) => {
  if (!softList) return 0;

  return Object.values(softList).reduce((acc, q) => (acc = q > acc ? q : acc));
};

export const getCardsArray = (cardsList) => {
  const cryptArr = [];
  Object.keys(cardsList).forEach((card) => {
    for (let i = 0; i < cardsList[card].q; i++) {
      cryptArr.push(cardsList[card].c);
    }
  });
  return cryptArr;
};

export const getClan = (crypt) => {
  const clans = {};

  Object.values(crypt)
    .filter((card) => card.c[NAME] !== 'Anarch Convert')
    .forEach((card) => {
      const clan = card.c[CLAN];
      if (clans[clan]) {
        clans[clan] += card.q;
      } else {
        clans[clan] = card.q;
      }
    });

  const topClan = Object.keys(clans).reduce(
    (acc, c) => {
      const t = acc.t + clans[c];

      if (clans[c] > acc.q) {
        return { clan: c, q: clans[c], t: t };
      } else {
        return { ...acc, t: t };
      }
    },
    { clan: null, q: 0, t: 0 },
  );

  if (topClan.q / topClan.t > 0.5) {
    return topClan[CLAN];
  } else {
    return null;
  }
};

export const getSect = (crypt) => {
  const sects = {};

  Object.values(crypt)
    .filter((card) => card.c[NAME] !== 'Anarch Convert')
    .forEach((card) => {
      const sect = card.c[SECT];
      if (sects[sect]) {
        sects[sect] += card.q;
      } else {
        sects[sect] = card.q;
      }
    });

  const topSect = Object.keys(sects).reduce(
    (acc, c) => {
      const t = acc.t + sects[c];
      if (sects[c] > acc.q) {
        return { sect: c, q: sects[c], t: t };
      } else {
        return { ...acc, t: t };
      }
    },
    { sect: null, q: 0, t: 0 },
  );

  if (topSect.q / topSect.t > 0.65) {
    return topSect.sect;
  } else {
    return null;
  }
};

export const getSwipedBg = (isSwiped, inInventory) => {
  if (isSwiped) {
    return isSwiped === 'right'
      ? 'bg-bgSuccess dark:bg-bgSuccessDark'
      : 'bg-bgErrorSecondary dark:bg-bgErrorSecondaryDark';
  } else {
    return inInventory ? '' : 'row-bg';
  }
};

export const deepClone = (v) => JSON.parse(JSON.stringify(v));
export const capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

export const getTextDisciplines = (disciplines) => {
  const disciplinesAndVirtues = { ...disciplinesList, ...virtuesList };

  const baseDisciplines = [];
  const supDisciplines = [];
  Object.keys(disciplines).forEach((d) => {
    if (disciplines[d] === 1) {
      baseDisciplines.push(disciplinesAndVirtues[d].toLowerCase());
    } else {
      supDisciplines.push(disciplinesAndVirtues[d].toUpperCase());
    }
  });

  return [...supDisciplines, ...baseDisciplines].join(' ');
};

export const parseDeckHash = (hash, cryptCardBase, libraryCardBase) => {
  const crypt = {};
  const library = {};

  hash
    .slice(1)
    .split(';')
    .forEach((i) => {
      const j = i.split('=');
      if (j[0] > 200000) {
        crypt[j[0]] = {
          q: parseInt(j[1]),
          c: cryptCardBase[j[0]],
        };
      } else {
        library[j[0]] = {
          q: parseInt(j[1]),
          c: libraryCardBase[j[0]],
        };
      }
    });
  return { crypt, library };
};

export const getIsEditable = (deck) => {
  if (!deck) return null;
  return deck[IS_AUTHOR] && !deck[IS_PUBLIC] && !deck[IS_FROZEN] && !deck[IS_NON_EDITABLE];
};
