import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { useSnapshot } from 'valtio';
import { set, setMany, getMany, update } from 'idb-keyval';
import {
  initFromStorage,
  setLocalStorage,
} from '@/services/storageServices.js';
import { cardServices } from '@/services';
import { useDeck, useWindowSize } from '@/hooks';
import { byTimestamp } from '@/utils';
import {
  setLimitedSets,
  setLimitedAllowedCrypt,
  setLimitedAllowedLibrary,
  setLimitedBannedCrypt,
  setLimitedBannedLibrary,
  setupUsedInventory,
  limitedFullStore,
  deckStore,
  inventoryStore,
  deckLocalize,
} from '@/context';

export const AppContext = React.createContext();

export const AppProvider = (props) => {
  const screenSize = useWindowSize();
  const isMobile = useMemo(() => screenSize <= 767, [screenSize]);
  const isNarrow = useMemo(() => screenSize <= 1024, [screenSize]);
  const isDesktop = useMemo(() => screenSize >= 1280, [screenSize]);
  const isWide = useMemo(() => screenSize >= 1440, [screenSize]);
  const isXWide = useMemo(() => screenSize >= 1920, [screenSize]);

  const [username, setUsername] = useState();
  const [publicName, setPublicName] = useState();
  const [email, setEmail] = useState();
  const [inventoryKey, setInventoryKey] = useState();
  const [lang, setLang] = useState('en-EN');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPlaytestAdmin, setIsPlaytestAdmin] = useState();
  const [isPlaytester, setIsPlaytester] = useState();
  const [playtestMode, setPlaytestMode] = useState();
  const [showImage, setShowImage] = useState();
  const [addMode, setAddMode] = useState();
  const [inventoryMode, setInventoryMode] = useState();
  const [limitedMode, setLimitedMode] = useState();
  const [searchInventoryMode, setSearchInventoryMode] = useState();
  const [cryptDeckSort, setCryptDeckSort] = useState();
  const [cryptSearchSort, setCryptSearchSort] = useState();
  const [librarySearchSort, setLibrarySearchSort] = useState();
  const [twdSearchSort, setTwdSearchSort] = useState();
  const [pdaSearchSort, setPdaSearchSort] = useState();
  const [analyzeSearchSort, setAnalyzeSearchSort] = useState();
  const [showCryptSearch, setShowCryptSearch] = useState(true);
  const [showLibrarySearch, setShowLibrarySearch] = useState(true);
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const [showMenuButtons, setShowMenuButtons] = useState();

  const [cryptCardBase, setCryptCardBase] = useImmer();
  const [libraryCardBase, setLibraryCardBase] = useImmer();
  const [nativeCrypt, setNativeCrypt] = useState();
  const [nativeLibrary, setNativeLibrary] = useState();
  const [localizedCrypt, setLocalizedCrypt] = useState();
  const [localizedLibrary, setLocalizedLibrary] = useState();
  const [preconDecks, setPreconDecks] = useState();

  const deck = useSnapshot(deckStore).deck;
  const decks = useSnapshot(deckStore).decks;
  const lastDeckArray = (decks &&
    Object.values(decks).toSorted(byTimestamp)) ?? [{ deckid: undefined }];
  const lastDeckId = lastDeckArray[0]?.deckid;
  const [recentDecks, setRecentDecks] = useState([]);

  // CARD BASE
  const CARD_VERSION = import.meta.env.VITE_CARD_VERSION;
  const fetchAndSetCardBase = (isIndexedDB = true) => {
    cardServices.getCardBase().then((data) => {
      if (isIndexedDB) {
        setMany([
          ['cardVersion', CARD_VERSION],
          ['cryptCardBase', data.crypt],
          ['libraryCardBase', data.library],
          ['nativeCrypt', data.nativeCrypt],
          ['nativeLibrary', data.nativeLibrary],
          ['localizedCrypt', { 'en-EN': data.nativeCrypt }],
          ['localizedLibrary', { 'en-EN': data.nativeLibrary }],
        ]);
      }

      setCryptCardBase(data.crypt);
      setLibraryCardBase(data.library);
      setNativeCrypt(data.nativeCrypt);
      setNativeLibrary(data.nativeLibrary);
      setLocalizedCrypt({ 'en-EN': data.nativeCrypt });
      setLocalizedLibrary({ 'en-EN': data.nativeLibrary });

      cardServices
        .getPreconDecks(data.crypt, data.library)
        .then((preconData) => {
          if (isIndexedDB) set('preconDecks', preconData);
          setPreconDecks(preconData);
        });
    });
  };

  const setLimitedFormat = (lac, lal, lbc, lbl, ls) => {
    if (lac) setLimitedAllowedCrypt(lac);
    if (lal) setLimitedAllowedLibrary(lal);
    if (lbc) setLimitedBannedCrypt(lbc);
    if (lbl) setLimitedBannedLibrary(lbl);
    if (ls) setLimitedSets(ls);
  };

  useEffect(() => {
    getMany([
      'cardVersion',
      'cryptCardBase',
      'libraryCardBase',
      'nativeCrypt',
      'nativeLibrary',
      'localizedCrypt',
      'localizedLibrary',
      'preconDecks',
      'limitedAllowedCrypt',
      'limitedAllowedLibrary',
      'limitedBannedCrypt',
      'limitedBannedLibrary',
      'limitedSets',
    ])
      .then(([v, cb, lb, nc, nl, lc, ll, pd, lac, lal, lbc, lbl, ls]) => {
        if (!v || CARD_VERSION > v) {
          fetchAndSetCardBase();
        } else {
          limitedFullStore.crypt = cb;
          limitedFullStore.library = lb;
          setCryptCardBase(cb);
          setLibraryCardBase(lb);
          setNativeCrypt(nc);
          setNativeLibrary(nl);
          setLocalizedCrypt(lc);
          setLocalizedLibrary(ll);
          setPreconDecks(pd);
          setLimitedFormat(lac, lal, lbc, lbl, ls);
        }
      })
      .catch(() => {
        fetchAndSetCardBase(false);
      });

    whoAmI();
  }, []);

  // USER
  const [userData, setUserData] = useState();
  const whoAmI = () => {
    const url = `${import.meta.env.VITE_API_URL}/account`;
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success === false) {
          setUserData(null);
        } else {
          setUserData(data);
        }
      });
  };

  const parseInventoryData = (inventoryData) => {
    Object.keys(inventoryData.crypt).forEach((i) => {
      if (cryptCardBase[i]) {
        inventoryData.crypt[i].c = cryptCardBase[i];
      } else {
        delete inventoryData.crypt[i];
      }
    });
    Object.keys(inventoryData.library).forEach((i) => {
      if (libraryCardBase[i]) {
        inventoryData.library[i].c = libraryCardBase[i];
      } else {
        delete inventoryData.library[i];
      }
    });

    return { crypt: inventoryData.crypt, library: inventoryData.library };
  };

  const initializeUserData = (data) => {
    setUsername(data.username);
    setPublicName(data.public_name);
    setEmail(data.email);
    setInventoryKey(data.inventory_key);
    setIsPlaytester(data.playtester);
    setIsPlaytestAdmin(data.playtest_admin);
    if (!data.playtester && !data.playtest_admin) setPlaytestMode(false);
    const { crypt, library } = parseInventoryData(data.inventory);
    inventoryStore.crypt = crypt;
    inventoryStore.library = library;
    deckStore.decks = parseDecksData(data.decks);
  };

  const initializeUnauthenticatedUser = () => {
    setAddMode(false);
    setInventoryMode(false);
    setLimitedMode(false);
    setIsPlaytester(false);
    setIsPlaytestAdmin(false);
    setPlaytestMode(false);
    setUsername(null);
    setEmail(undefined);
    inventoryStore.crypt = {};
    inventoryStore.library = {};
    if (decks?.[deck?.deckid]) {
      deckStore.deck = undefined;
    }
    deckStore.decks = undefined;
  };

  useEffect(() => {
    if (cryptCardBase && libraryCardBase) {
      if (userData === null) {
        initializeUnauthenticatedUser();
      } else if (userData) {
        initializeUserData(userData);
      }
    }
  }, [userData, cryptCardBase, libraryCardBase]);

  // LANGUAGE
  const changeLang = (lang) => {
    setLang(lang);
    setLocalStorage('lang', lang);
  };

  const changeBaseTextToLocalizedText = (
    setCardBase,
    localizedInfo,
    nativeInfo
  ) => {
    setCardBase((draft) => {
      Object.keys(draft).forEach((k) => {
        const newInfo = localizedInfo[k] ? localizedInfo[k] : nativeInfo[k];
        draft[k]['Name'] = newInfo['Name'];
        draft[k]['Card Text'] = newInfo['Card Text'];
      });
    });
  };

  const initializeLocalizedInfo = async (lang) => {
    cardServices.getLocalizedCardBase(lang).then((data) => {
      update('localizedCrypt', (val) => ({
        ...val,
        [lang]: data.crypt,
      }));
      update('localizedLibrary', (val) => ({
        ...val,
        [lang]: data.library,
      }));
      setLocalizedCrypt((prevState) => ({
        ...prevState,
        [lang]: data.crypt,
      }));
      setLocalizedLibrary((prevState) => ({
        ...prevState,
        [lang]: data.library,
      }));
      changeBaseTextToLocalizedText(setCryptCardBase, data.crypt, nativeCrypt);
      changeBaseTextToLocalizedText(
        setLibraryCardBase,
        data.library,
        nativeLibrary
      );
    });
  };

  useEffect(() => {
    async function triggerLangChange() {
      if (!localizedCrypt[lang] || !localizedLibrary[lang]) {
        await initializeLocalizedInfo(lang);
      } else {
        changeBaseTextToLocalizedText(
          setCryptCardBase,
          localizedCrypt[lang],
          nativeCrypt
        );
        changeBaseTextToLocalizedText(
          setLibraryCardBase,
          localizedLibrary[lang],
          nativeLibrary
        );
      }
    }
    if (cryptCardBase && libraryCardBase) {
      triggerLangChange();
    }
  }, [lang, nativeCrypt, nativeLibrary]);

  useEffect(() => {
    if (
      deck &&
      localizedCrypt?.[lang] &&
      localizedLibrary?.[lang] &&
      Object.keys(localizedCrypt).length > 1
    ) {
      deckLocalize(
        localizedCrypt[lang],
        nativeCrypt,
        localizedLibrary[lang],
        nativeLibrary
      );
    }
  }, [deck?.deckid, lang, localizedCrypt, localizedLibrary]);

  // APP DATA
  const toggleShowImage = () => {
    setShowImage(!showImage);
    setLocalStorage('showImage', !showImage);
  };

  const toggleInventoryMode = () => {
    setInventoryMode(!inventoryMode);
    setLocalStorage('inventoryMode', !inventoryMode);
  };

  const toggleLimitedMode = () => {
    setLimitedMode(!limitedMode);
    setLocalStorage('limitedMode', !limitedMode);
  };

  const togglePlaytestMode = () => {
    setPlaytestMode(!playtestMode);
    setLocalStorage('playtestMode', !playtestMode);
  };

  const toggleAddMode = () => {
    setAddMode(!addMode);
    setLocalStorage('addMode', !addMode);
  };

  const changeCryptDeckSort = (method) => {
    setCryptDeckSort(method);
    setLocalStorage('cryptDeckSort', method);
  };

  const changeCryptSearchSort = (method) => {
    setCryptSearchSort(method);
    setLocalStorage('cryptSearchSort', method);
  };

  const changeLibrarySearchSort = (method) => {
    setLibrarySearchSort(method);
    setLocalStorage('librarySearchSort', method);
  };

  const changeTwdSearchSort = (method) => {
    setTwdSearchSort(method);
    setLocalStorage('twdSearchSort', method);
  };

  const changePdaSearchSort = (method) => {
    setPdaSearchSort(method);
    setLocalStorage('pdaSearchSort', method);
  };

  const changeAnalyzeSearchSort = (method) => {
    setAnalyzeSearchSort(method);
    setLocalStorage('analyzeSearchSort', method);
  };

  const addRecentDeck = (deck) => {
    const src =
      deck.deckid.length != 32 ? 'twd' : deck.publicParent ? 'pda' : 'shared';
    let d = [...recentDecks];
    const idx = recentDecks.map((v) => v.deckid).indexOf(deck.deckid);
    if (idx !== -1) d.splice(idx, 1);
    d.unshift({
      deckid: deck.deckid,
      name: deck.name,
      src: src,
    });
    if (d.length > 10) d = d.slice(0, 10);
    setRecentDecks(d);
    setLocalStorage('recentDecks', d);
  };

  const updateRecentDecks = (decks) => {
    setRecentDecks(decks);
    setLocalStorage('recentDecks', decks);
  };

  useEffect(() => {
    window.addEventListener('offline', () => setIsOnline(false));
    window.addEventListener('online', () => setIsOnline(true));

    return () => {
      window.removeEventListener('offline', () => setIsOnline(false));
      window.removeEventListener('online', () => setIsOnline(true));
    };
  }, []);

  useLayoutEffect(() => {
    initFromStorage(
      'cryptSearchSort',
      'Capacity - Min to Max',
      setCryptSearchSort
    );
    initFromStorage('cryptDeckSort', 'Quantity ', setCryptDeckSort);
    initFromStorage('librarySearchSort', 'Type', setLibrarySearchSort);
    initFromStorage('twdSearchSort', 'Date - New to Old', setTwdSearchSort);
    initFromStorage('pdaSearchSort', 'Date - New to Old', setPdaSearchSort);
    initFromStorage(
      'analyzeSearchSort',
      'Rank - High to Low',
      setAnalyzeSearchSort
    );
    initFromStorage('lang', 'en-EN', setLang);
    initFromStorage('addMode', isDesktop, setAddMode);
    initFromStorage('inventoryMode', false, setInventoryMode);
    initFromStorage('limitedMode', false, setLimitedMode);
    initFromStorage('showImage', true, setShowImage);
    initFromStorage('recentDecks', [], setRecentDecks);
    initFromStorage('playtestMode', false, setPlaytestMode);
  }, []);

  // DECKS
  const parseDecksData = (decksData) => {
    Object.keys(decksData).forEach((deckid) => {
      const cardsData = useDeck(
        decksData[deckid].cards,
        cryptCardBase,
        libraryCardBase
      );

      decksData[deckid] = { ...decksData[deckid], ...cardsData };
      if (decksData[deckid].usedInInventory) {
        Object.keys(decksData[deckid].usedInInventory).forEach((cardid) => {
          if (cardid > 200000) {
            if (decksData[deckid].crypt[cardid]) {
              decksData[deckid].crypt[cardid].i =
                decksData[deckid].usedInInventory[cardid];
            }
          } else {
            if (decksData[deckid].library[cardid]) {
              decksData[deckid].library[cardid].i =
                decksData[deckid].usedInInventory[cardid];
            }
          }
        });
      }
      decksData[deckid].isAuthor = true;
      decksData[deckid].master =
        decksData[deckid].master !== '' ? decksData[deckid].master : null;
      decksData[deckid].isBranches = !!(
        decksData[deckid].master || decksData[deckid].branches?.length > 0
      );
      delete decksData[deckid].cards;
    });

    return decksData;
  };

  useEffect(() => {
    if (decks || username === null) {
      const d = recentDecks.filter(
        (v) => username === null || !decks[v.deckid]
      );
      if (d.length < recentDecks.length) {
        updateRecentDecks(d);
      }
    }
  }, [decks, recentDecks]);

  useEffect(() => {
    if (decks && inventoryMode) setupUsedInventory(decks);
  }, [deck, inventoryMode]);

  return (
    <AppContext.Provider
      value={{
        // APP Context
        isMobile,
        isNarrow,
        isWide,
        isXWide,
        isDesktop,
        lang,
        changeLang,
        isPlaytester,
        isPlaytestAdmin,
        playtestMode,
        togglePlaytestMode,
        searchInventoryMode,
        setSearchInventoryMode,
        inventoryMode,
        toggleInventoryMode,
        limitedMode,
        toggleLimitedMode,
        setLimitedFormat,
        setInventoryMode,
        addMode,
        toggleAddMode,
        showImage,
        setShowImage,
        toggleShowImage,
        showFloatingButtons,
        setShowFloatingButtons,
        showMenuButtons,
        setShowMenuButtons,
        isOnline,

        // USER Context
        whoAmI,
        username,
        setUsername,
        publicName,
        setPublicName,
        email,
        setEmail,
        inventoryKey,
        setInventoryKey,
        initializeUserData,
        initializeUnauthenticatedUser,

        // CARDBASE Context
        cryptCardBase,
        setCryptCardBase,
        libraryCardBase,
        setLibraryCardBase,
        localizedCrypt,
        localizedLibrary,
        nativeCrypt,
        nativeLibrary,

        // DECK Context
        preconDecks,
        recentDecks,
        addRecentDeck,
        lastDeckId,

        // LISTING Context
        showCryptSearch,
        setShowCryptSearch,
        showLibrarySearch,
        setShowLibrarySearch,

        // SORTING Context
        cryptSearchSort,
        changeCryptSearchSort,
        librarySearchSort,
        changeLibrarySearchSort,
        twdSearchSort,
        changeTwdSearchSort,
        pdaSearchSort,
        changePdaSearchSort,
        analyzeSearchSort,
        changeAnalyzeSearchSort,
        cryptDeckSort,
        changeCryptDeckSort,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
