import ky from 'ky';
import { redirect, defer } from 'react-router-dom';
import { useDeckExport } from '@/hooks';
import { getTextDisciplines } from '@/utils';
import {
  ADV,
  ANONYMOUS,
  AUTHOR,
  BLOOD,
  BRANCHES,
  BRANCH_NAME,
  CAPACITY,
  CARDS,
  CLAN,
  CRYPT,
  DECK,
  DECKID,
  DECKS,
  DESCRIPTION,
  DISCIPLINES,
  GROUP,
  ID,
  INVENTORY_TYPE,
  IS_AUTHOR,
  IS_BRANCHES,
  IS_PUBLIC,
  LIBRARY,
  MASTER,
  NAME,
  NEW,
  POOL,
  TAGS,
  TEXT,
  TIMESTAMP,
  TYPE,
  XLSX,
} from '@/constants';
import { deckStore } from '@/context';

export const update = (deckid, field, value) => {
  const url = `${import.meta.env.VITE_API_URL}/deck/${deckid}`;
  return ky.put(url, { json: { [field]: value } }).json();
};

export const cardChange = (deckid, cardid, q) => {
  const url = `${import.meta.env.VITE_API_URL}/deck/${deckid}`;
  return ky.put(url, { json: { cardChange: { [cardid]: q } } }).json();
};

export const deckImport = (deck) => {
  const url = `${import.meta.env.VITE_API_URL}/deck`;
  const cards = {};
  Object.values({ ...deck[CRYPT], ...deck[LIBRARY] }).forEach((card) => {
    cards[card.c[ID]] = card.q;
  });

  return ky
    .post(url, {
      json: {
        [NAME]: deck[NAME],
        [DESCRIPTION]: deck[DESCRIPTION],
        [AUTHOR]: deck[AUTHOR],
        [CARDS]: cards,
        [ANONYMOUS]: deck.anonymous,
      },
    })
    .json();
};

export const deckDelete = (deck) => {
  const url = `${import.meta.env.VITE_API_URL}/deck/${deck[DECKID]}`;
  return ky.delete(url).then(() => delete deckStore[DECKS][deck[MASTER] ?? deck[DECKID]]);
};

export const deckClone = (deck) => {
  const url = `${import.meta.env.VITE_API_URL}/deck`;
  const name = `${deck[NAME]} [by ${deck[AUTHOR]}]`;
  const cards = {};
  Object.keys(deck[CRYPT]).forEach((cardid) => (cards[cardid] = deck[CRYPT][cardid].q));
  Object.keys(deck[LIBRARY]).forEach((cardid) => (cards[cardid] = deck[LIBRARY][cardid].q));

  return ky
    .post(url, {
      json: {
        [NAME]: name,
        [DESCRIPTION]: deck[DESCRIPTION],
        [AUTHOR]: deck[AUTHOR],
        [CARDS]: cards,
        [TAGS]: deck[TAGS],
      },
    })
    .json()
    .then((data) => {
      if (data.error === undefined) {
        const now = new Date();

        deckStore[DECKS][data[DECKID]] = {
          [BRANCH_NAME]: null,
          [BRANCHES]: [],
          [CRYPT]: { ...deck[CRYPT] },
          [LIBRARY]: { ...deck[LIBRARY] },
          [DECKID]: data[DECKID],
          [MASTER]: null,
          [NAME]: name,
          [TIMESTAMP]: now.toUTCString(),
          [TAGS]: deck[TAGS],
          [AUTHOR]: deck[AUTHOR],
          [DESCRIPTION]: deck[DESCRIPTION],
          [IS_AUTHOR]: true,
          [IS_BRANCHES]: false,
        };

        return data[DECKID];
      }
    });
};

export const deckSnapshot = (deck) => {
  const url = `${import.meta.env.VITE_API_URL}/deck`;
  const cards = {};
  Object.keys(deck[CRYPT]).forEach((cardid) => (cards[cardid] = deck[CRYPT][cardid].q));
  Object.keys(deck[LIBRARY]).forEach((cardid) => (cards[cardid] = deck[LIBRARY][cardid].q));

  return ky
    .post(url, {
      json: {
        [NAME]: deck[NAME],
        [DESCRIPTION]: deck[DESCRIPTION],
        [AUTHOR]: deck[AUTHOR],
        [CARDS]: cards,
        [TAGS]: deck[TAGS],
        [ANONYMOUS]: true,
      },
    })
    .json()
    .then((data) => data[DECKID]);
};

export const branchesImport = (masterId, branches) => {
  const url = `${import.meta.env.VITE_API_URL}/deck/${masterId}/branch`;

  return ky
    .post(url, {
      json: { branches: branches },
    })
    .json()
    .then((data) => {
      data.forEach((branch, idx) => {
        branches[idx][DECKID] = branch[DECKID];
        branches[idx][BRANCH_NAME] = branch[BRANCH_NAME];
      });

      return branches;
    });
};

export const branchDelete = (deckid, decks) => {
  const url = `${import.meta.env.VITE_API_URL}/deck/${deckid}/branch`;

  return ky.delete(url).then(() => {
    let masterId = decks[deckid][MASTER] || null;
    const branches = masterId ? [...decks[masterId][BRANCHES]] : [...decks[deckid][BRANCHES]];

    if (masterId) {
      branches.splice(branches.indexOf(deckid), 1);
      deckStore[DECKS][masterId][BRANCHES] = branches;
      deckStore[DECKS][masterId].isBranches = branches.length > 0;
    } else {
      masterId = branches.pop();
      deckStore[DECKS][masterId][BRANCHES] = branches;
      deckStore[DECKS][masterId].isBranches = branches.length > 0;
      deckStore[DECKS][masterId][MASTER] = null;
      branches.map((b) => {
        deckStore[DECKS][b][MASTER] = masterId;
      });
    }

    delete deckStore[DECKS][deckid];
    return masterId;
  });
};

export const branchCreate = (deck, branch) => {
  const master = deck[MASTER] ?? deck[DECKID];
  const url = `${import.meta.env.VITE_API_URL}/deck/${master}/branch`;

  return ky
    .post(url, { json: { deckid: branch[DECKID] } })
    .json()
    .then((data) => {
      const now = new Date();
      deckStore[DECKS][master][MASTER] = null;
      deckStore[DECKS][master].isBranches = true;
      deckStore[DECKS][master][BRANCHES] = deckStore[DECKS][master][BRANCHES]
        ? [...deckStore[DECKS][master][BRANCHES], data[0][DECKID]]
        : [data[0][DECKID]];

      deckStore[DECKS][data[0][DECKID]] = {
        ...deck,
        [DECKID]: data[0][DECKID],
        [DESCRIPTION]: `[${now.toISOString().split('T')[0]}]\n${branch[DESCRIPTION]}`,
        [TAGS]: branch[TAGS],
        [CRYPT]: { ...branch[CRYPT] },
        [LIBRARY]: { ...branch[LIBRARY] },
        [INVENTORY_TYPE]: '',
        [MASTER]: master,
        [BRANCH_NAME]: data[0][BRANCH_NAME],
        [IS_PUBLIC]: false,
        [IS_BRANCHES]: true,
        [TIMESTAMP]: now.toUTCString(),
      };
      return data[0][DECKID];
    });
};

export const publicSync = (deck, decks) => {
  const url = `${import.meta.env.VITE_API_URL}/pda/${deck[DECKID]}`;
  return ky
    .put(url)
    .json()
    .then(() => {
      deckStore[DECK][CRYPT] = { ...decks[deck.publicParent][CRYPT] };
      deckStore[DECK][LIBRARY] = { ...decks[deck.publicParent][LIBRARY] };
    });
};

export const publicCreateOrDelete = (deck) => {
  const url = `${import.meta.env.VITE_API_URL}/pda/${deck[DECKID]}`;

  const isPublished = !!(deck.publicParent || deck.publicChild);
  const parentId = deck.publicParent ?? deck[DECKID];

  return ky(url, {
    method: isPublished ? 'DELETE' : 'POST',
  })
    .json()
    .then((data) => {
      deckStore[DECKS][parentId].publicChild = isPublished ? null : data[DECKID];
      return data[DECKID];
    });
};

export const getDeckFromAmaranth = async (deckUrl) => {
  const url = `${import.meta.env.VITE_AMARANTH_API_URL}/deck`;
  const id = deckUrl.replace(/.*#deck\//i, '');

  const deck = await ky
    .post(url, {
      body: `id=${id}`,
    })
    .json();

  return deck.result;
};

export const exportDecks = async (decks, format) => {
  const { default: JSzip } = await import('jszip');
  const zip = JSzip();
  const date = new Date().toISOString().split('T')[0];

  if (format === XLSX) {
    const fetchPromises = Object.values(decks).map((deck) => {
      let deckName = deck[NAME];
      if (deck[BRANCH_NAME] && (deck[MASTER] || deck[BRANCHES].length > 0)) {
        deckName += ` [${deck[BRANCH_NAME]}]`;
      }

      return { deckName: deckName, file: exportXlsx(deck) };
    });

    const folder = zip.folder(`Decks ${date} [${format}]`);
    Promise.all(fetchPromises).then((deckExports) => {
      deckExports.forEach((d) => {
        folder.file(`${d.deckName}.xlsx`, d.file, {
          base64: true,
        });
      });

      zip
        .generateAsync({ type: 'blob' })
        .then((blob) => saveFile(blob, `Decks ${date} [${format}].zip`));
    });
  } else {
    Object.values(decks).forEach((deck) => {
      let deckName = deck[NAME];
      if (deck[BRANCH_NAME] && (deck[MASTER] || deck[BRANCHES].length > 0)) {
        deckName += ` [${deck[BRANCH_NAME]}]`;
      }

      zip.folder(`Decks ${date} [${format}]`).file(`${deckName}.txt`, useDeckExport(deck, format));
    });

    zip
      .generateAsync({ type: 'blob' })
      .then((blob) => saveFile(blob, `Decks ${date} [${format}].zip`));
  }
};

export const exportXlsx = async (deck) => {
  const XLSX = await import('xlsx');
  const crypt = Object.values(deck[CRYPT]).map((card) => {
    const c = card.c;
    let name = c[NAME];
    if (c[ADV] && c[ADV][0]) name += ' (ADV)';
    if (c[NEW]) name += ` (G${c[GROUP]})`;

    return {
      Quantity: card.q,
      Card: name,
      Disciplines: getTextDisciplines(c[DISCIPLINES]),
      Capacity: c[CAPACITY],
      Group: c[GROUP],
      Clan: c[CLAN],
      Text: c[TEXT].replace(/ ?\[\w+\]/g, ''),
    };
  });

  const library = Object.values(deck[LIBRARY]).map((card) => {
    const c = card.c;
    return {
      Quantity: card.q,
      Card: c[NAME],
      Type: c[TYPE],
      Clan: c[CLAN],
      'Blood Cost': c[BLOOD],
      'Pool Cost': c[POOL],
      Text: c[TEXT].replace(/ ?\[\w+\]/g, ''),
    };
  });

  const cryptSheet = XLSX.utils.json_to_sheet(crypt);
  const librarySheet = XLSX.utils.json_to_sheet(library);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, cryptSheet, 'Crypt');
  XLSX.utils.book_append_sheet(workbook, librarySheet, 'Library');
  return XLSX.write(workbook, { type: 'array', bookType: XLSX });
};

const saveFile = async (file, name) => {
  const { saveAs } = await import('file-saver');
  saveAs(file, name);
};

export const deckLoader = async ({ params }) => {
  const deckid = params[DECKID];

  if (deckid === DECK || deckid.includes(':')) return null;
  if (deckid.length == 32) {
    return redirect(`/decks/${deckid.substring(0, 9)}`);
  }

  const response = getDeck(deckid);
  return defer({ deckData: response });
};

export const getDeck = (deckid) => {
  const url = `${import.meta.env.VITE_API_URL}/deck/${deckid}`;
  return ky.get(url).json();
};
