import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useSnapshot } from 'valtio';
import {
  ButtonFloatSearch,
  ButtonFloatClose,
  SearchFormTextAndButtons,
  SearchFormSet,
  SearchFormPrecon,
  SearchFormArtist,
  CryptSearchFormDisciplines,
  CryptSearchFormVirtues,
  CryptSearchFormCapacity,
  CryptSearchFormClan,
  CryptSearchFormSect,
  CryptSearchFormVotes,
  CryptSearchFormTitles,
  CryptSearchFormGroup,
  CryptSearchFormTraits,
} from '@/components';
import { filterCrypt, getIsPlaytest, sanitizeFormState } from '@/utils';
import { useDebounce } from '@/hooks';
import {
  useApp,
  setCryptResults,
  searchCryptForm,
  clearSearchForm,
  inventoryStore,
  usedStore,
  limitedStore,
} from '@/context';
import {
  AGE,
  ARTIST,
  CAPACITY,
  CLAN,
  CRYPT,
  DISCIPLINES,
  EQ,
  FIRST,
  GE,
  GROUP,
  HARD,
  ID,
  LE,
  NAME,
  NOT_NEWER,
  NOT_OLDER,
  ONLY,
  OR_NEWER,
  OR_OLDER,
  PRECON,
  PRINT,
  REPRINT,
  SECT,
  SET,
  SOFT,
  TEXT,
  TITLES,
  TRAITS,
  VOTES,
} from '@/constants';

const CryptSearchForm = () => {
  const {
    cryptCardBase,
    searchInventoryMode,
    searchMissingInventoryMode,
    showFloatingButtons,
    inventoryMode,
    isMobile,
    playtestMode,
    limitedMode,
  } = useApp();
  const inventoryCrypt = useSnapshot(inventoryStore)[CRYPT];
  const usedCrypt = useSnapshot(usedStore)[CRYPT];
  const limitedCrypt = useSnapshot(limitedStore)[CRYPT];
  const cryptFormState = useSnapshot(searchCryptForm);
  const [error, setError] = useState(false);
  const [preresults, setPreresults] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = JSON.parse(searchParams.get('q'));
  const SHOW_LIMIT = 300;

  useEffect(() => {
    if (query) {
      Object.keys(query).forEach((i) => {
        searchCryptForm[i] = query[i];
      });
    }
  }, []);

  useEffect(() => {
    if (isMobile && query && cryptFormState && cryptCardBase) {
      processSearch();
    }
  }, [cryptFormState, cryptCardBase]);

  const handleTextChange = (formId, value) => {
    searchCryptForm[TEXT][formId].value = value;
  };

  useEffect(
    () => textInputsAndSearch(),
    [
      cryptFormState[TEXT],
      cryptFormState[ARTIST],
      cryptFormState[CAPACITY],
      cryptFormState[CLAN],
      cryptFormState[GROUP],
      cryptFormState[PRECON],
      cryptFormState[SECT],
      cryptFormState[SET],
      cryptFormState[TITLES],
      cryptFormState[TRAITS],
      cryptFormState[VOTES],
      searchInventoryMode,
      searchMissingInventoryMode,
      inventoryMode,
      limitedMode,
      playtestMode,
      cryptCardBase,
    ],
  );

  useDebounce(() => textInputsAndSearch(), 300, [
    cryptFormState[DISCIPLINES],
    searchInventoryMode,
    searchMissingInventoryMode,
    inventoryMode,
    limitedMode,
    playtestMode,
    cryptCardBase,
  ]);

  useEffect(() => {
    if (!isMobile && preresults) {
      if (preresults.length <= SHOW_LIMIT) {
        setCryptResults(preresults);
      } else {
        setCryptResults(undefined);
      }
    }
  }, [preresults]);

  const handleTextCheckboxesChange = (event) => {
    console.log(event);
    const { name, value } = event.currentTarget;

    if ([NAME, TEXT].includes(value)) {
      searchCryptForm[TEXT][name]['in'] =
        searchCryptForm[TEXT][name]['in'] === value ? false : value;
    } else {
      searchCryptForm[TEXT][name][value] = !searchCryptForm[TEXT][name][value];
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event;
    searchCryptForm[name] = value;
  };

  const handleMultiSelectChange = (event, id) => {
    const i = id[NAME];
    const { name, value } = event;

    if ([CAPACITY].includes(name)) {
      if ([LE, GE, EQ].includes(value)) {
        searchCryptForm[name].value[i].moreless = value;
      } else {
        searchCryptForm[name].value[i][name] = value;
      }
    } else {
      searchCryptForm[name].value[i] = value;
    }
  };

  const handleMultiChange = (event) => {
    const { name, value } = event.currentTarget;

    if ([OR_NEWER, OR_OLDER, NOT_NEWER, NOT_OLDER].includes(value)) {
      searchCryptForm[name][AGE] = searchCryptForm[name][AGE] === value ? false : value;
    } else if ([ONLY, FIRST, REPRINT].includes(value)) {
      searchCryptForm[name][PRINT] = searchCryptForm[name][PRINT] === value ? false : value;
    } else {
      searchCryptForm[name][value] = !searchCryptForm[name][value];
    }
  };

  const handleDisciplinesChange = (name, max) => {
    if (cryptFormState[DISCIPLINES][name] < max) {
      searchCryptForm[DISCIPLINES][name] += 1;
    } else {
      searchCryptForm[DISCIPLINES][name] = 0;
    }
  };

  const handleClear = () => {
    setSearchParams();
    clearSearchForm(CRYPT);
    setError(false);
  };

  const handleShowResults = () => {
    setCryptResults(preresults);
  };

  const processSearch = () => {
    setError(false);
    const sanitizedForm = sanitizeFormState(CRYPT, cryptFormState);

    if (Object.entries(sanitizedForm).length === 0) {
      setError('EMPTY REQUEST');
      return;
    }

    const filteredCards = filterCrypt(
      limitedMode ? limitedCrypt : cryptCardBase,
      sanitizedForm,
    ).filter((card) => playtestMode || !getIsPlaytest(card[ID]));

    if (isMobile && filteredCards.length == 0) {
      setError('NO CARDS FOUND');
      return;
    }

    setSearchParams({ q: JSON.stringify(sanitizedForm) });

    const setResults = isMobile ? setCryptResults : setPreresults;
    if (searchInventoryMode && inventoryMode) {
      setResults(
        filteredCards.filter((card) => {
          return inventoryCrypt[card[ID]] || usedCrypt[SOFT][card[ID]] || usedCrypt[HARD][card[ID]];
        }),
      );
    } else if (searchMissingInventoryMode && inventoryMode) {
      setResults(filteredCards.filter((card) => !inventoryCrypt[card[ID]]?.q));
    } else {
      setResults(filteredCards);
    }
  };

  const textInputsAndSearch = () => {
    if (!isMobile && cryptCardBase) {
      const input = sanitizeFormState(CRYPT, cryptFormState);
      if (Object.keys(input).length === 0) {
        if (query) {
          setCryptResults(undefined);
          setPreresults(undefined);
          setSearchParams();
        }
      } else if (!cryptFormState[TEXT][0].value || cryptFormState[TEXT][0].value.length > 2) {
        processSearch();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <SearchFormTextAndButtons
        value={cryptFormState[TEXT]}
        onChange={handleTextChange}
        onChangeOptions={handleTextCheckboxesChange}
        searchForm={searchCryptForm}
        handleShowResults={handleShowResults}
        handleClear={handleClear}
        preresults={preresults?.length}
        showLimit={SHOW_LIMIT}
      />
      <CryptSearchFormDisciplines
        value={cryptFormState[DISCIPLINES]}
        onChange={handleDisciplinesChange}
      />
      <CryptSearchFormVirtues
        value={cryptFormState[DISCIPLINES]}
        onChange={handleDisciplinesChange}
      />
      <CryptSearchFormCapacity
        value={cryptFormState[CAPACITY]}
        onChange={handleMultiSelectChange}
        searchForm={searchCryptForm}
      />
      <CryptSearchFormClan
        value={cryptFormState[CLAN]}
        onChange={handleMultiSelectChange}
        searchForm={searchCryptForm}
      />
      <CryptSearchFormSect
        value={cryptFormState[SECT]}
        onChange={handleMultiSelectChange}
        searchForm={searchCryptForm}
      />
      <CryptSearchFormVotes value={cryptFormState[VOTES]} onChange={handleSelectChange} />
      <CryptSearchFormTitles value={cryptFormState[TITLES]} onChange={handleMultiChange} />
      <CryptSearchFormGroup value={cryptFormState[GROUP]} onChange={handleMultiChange} />
      <CryptSearchFormTraits value={cryptFormState[TRAITS]} onChange={handleMultiChange} />
      <SearchFormSet
        value={cryptFormState[SET]}
        onChange={handleMultiSelectChange}
        onChangeOptions={handleMultiChange}
        searchForm={searchCryptForm}
      />
      <SearchFormPrecon
        value={cryptFormState[PRECON]}
        onChange={handleMultiSelectChange}
        onChangeOptions={handleMultiChange}
        searchForm={searchCryptForm}
      />
      <SearchFormArtist
        value={cryptFormState[ARTIST]}
        onChange={handleSelectChange}
        target={CRYPT}
      />
      {isMobile && showFloatingButtons && (
        <>
          <ButtonFloatClose handleClose={handleClear} position="middle" />
          <ButtonFloatSearch handleSearch={processSearch} error={error} />
        </>
      )}
    </div>
  );
};

export default CryptSearchForm;
