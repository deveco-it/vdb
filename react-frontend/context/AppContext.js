import React, { useState, useLayoutEffect } from 'react';
import defaultsTwdForm from '../pages/components/forms_data/defaultsTwdForm.json';
import defaultsCryptForm from '../pages/components/forms_data/defaultsCryptForm.json';
import defaultsLibraryForm from '../pages/components/forms_data/defaultsLibraryForm.json';

const AppContext = React.createContext({
  isMobile: false,
  username: undefined,
  setUsername: () => {},
  lang: 'en-EN',
  setLang: () => {},
  publicName: undefined,
  setPublicName: () => {},
  email: undefined,
  setEmail: () => {},
  localizedCrypt: undefined,
  showImage: true,
  setShowImage: () => {},
  addMode: false,
  setAddMode: () => {},
  hideMissing: false,
  setHideMissing: () => {},
  inventoryMode: false,
  setInventoryMode: () => {},

  cryptCardBase: undefined,
  setCryptCardBase: () => {},
  libraryCardBase: undefined,
  setLibraryCardBase: () => {},
  setLocalizedCrypt: () => {},
  localizedLibrary: undefined,
  setLocalizedLibrary: () => {},
  nativeCrypt: undefined,
  setNativeCrypt: () => {},
  nativeLibrary: undefined,
  setNativeLibrary: () => {},

  twdFormState: undefined,
  setTwdFormState: () => {},
  cryptFormState: undefined,
  setCryptFormState: () => {},
  libraryFormState: undefined,
  setLibraryFormState: () => {},

  twdResults: undefined,
  setTwdResults: () => {},
  cryptResults: undefined,
  setCryptResults: () => {},
  libraryResults: undefined,
  setLibraryResults: () => {},

  usedCryptCards: undefined,
  setUsedCryptCards: () => {},
  usedLibraryCards: undefined,
  setUsedLibraryCards: () => {},

  showTwdSearch: undefined,
  setShowTwdSearch: () => {},
  showCryptSearch: undefined,
  setShowCryptSearch: () => {},
  showLibrarySearch: undefined,
  setShowLibrarySearch: () => {},

  inventoryCrypt: undefined,
  setInventoryCrypt: () => {},
  inventoryLibrary: undefined,
  setInventoryLibrary: () => {},
});

export default AppContext;

export const AppProvider = (props) => {
  const isMobile = window.matchMedia('(max-width: 540px)').matches;
  const [username, setUsername] = useState(undefined);
  const [publicName, setPublicName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [lang, setLang] = useState('en-EN');
  const [showImage, setShowImage] = useState(true);
  const [addMode, setAddMode] = useState(false);
  const [inventoryMode, setInventoryMode] = useState(false);
  const [hideMissing, setHideMissing] = useState(false);

  const [cryptCardBase, setCryptCardBase] = useState(undefined);
  const [libraryCardBase, setLibraryCardBase] = useState(undefined);
  const [localizedCrypt, setLocalizedCrypt] = useState(undefined);
  const [localizedLibrary, setLocalizedLibrary] = useState(undefined);
  const [nativeCrypt, setNativeCrypt] = useState(undefined);
  const [nativeLibrary, setNativeLibrary] = useState(undefined);

  const [twdFormState, setTwdFormState] = useState(defaultsTwdForm);
  const [cryptFormState, setCryptFormState] = useState(defaultsCryptForm);
  const [libraryFormState, setLibraryFormState] = useState(defaultsLibraryForm);

  const [twdResults, setTwdResults] = useState(undefined);
  const [cryptResults, setCryptResults] = useState(undefined);
  const [libraryResults, setLibraryResults] = useState(undefined);

  const [usedCryptCards, setUsedCryptCards] = useState({
    soft: {},
    hard: {},
  });
  const [usedLibraryCards, setUsedLibraryCards] = useState({
    soft: {},
    hard: {},
  });

  const [showTwdSearch, setShowTwdSearch] = useState(true);
  const [showCryptSearch, setShowCryptSearch] = useState(true);
  const [showLibrarySearch, setShowLibrarySearch] = useState(true);

  const [inventoryCrypt, setInventoryCrypt] = useState({});
  const [inventoryLibrary, setInventoryLibrary] = useState({});

  const changeLang = (lang) => {
    setLang(lang);
    window.localStorage.setItem('lang', lang);
  };

  useLayoutEffect(() => {
    const lastLang = window.localStorage.getItem('lang');

    if (lastLang) {
      setLang(lastLang);
    } else {
      setLang('en-EN');
    }
  }, [lang]);

  return (
    <AppContext.Provider
      value={{
        isMobile,
        username,
        setUsername,
        publicName,
        setPublicName,
        email,
        setEmail,
        lang,
        changeLang,
        hideMissing,
        setHideMissing,
        inventoryMode,
        setInventoryMode,
        addMode,
        setAddMode,
        showImage,
        setShowImage,

        cryptCardBase,
        setCryptCardBase,
        libraryCardBase,
        setLibraryCardBase,
        localizedCrypt,
        setLocalizedCrypt,
        localizedLibrary,
        setLocalizedLibrary,
        nativeCrypt,
        setNativeCrypt,
        nativeLibrary,
        setNativeLibrary,

        twdFormState,
        setTwdFormState,
        cryptFormState,
        setCryptFormState,
        libraryFormState,
        setLibraryFormState,

        twdResults,
        setTwdResults,
        cryptResults,
        setCryptResults,
        libraryResults,
        setLibraryResults,

        usedCryptCards,
        setUsedCryptCards,
        usedLibraryCards,
        setUsedLibraryCards,

        showTwdSearch,
        setShowTwdSearch,
        showCryptSearch,
        setShowCryptSearch,
        showLibrarySearch,
        setShowLibrarySearch,

        inventoryCrypt,
        setInventoryCrypt,
        inventoryLibrary,
        setInventoryLibrary,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
