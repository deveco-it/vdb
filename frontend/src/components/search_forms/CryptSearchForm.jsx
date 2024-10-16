import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { sanitizeFormState } from '@/utils';
import { useDebounce, useFilters } from '@/hooks';
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
  GE,
  LE,
  EQ,
  OR_NEWER,
  OR_OLDER,
  NOT_NEWER,
  NOT_OLDER,
  PRINT,
  REPRINT,
  FIRST,
  ONLY,
  CRYPT,
} from '@/utils/constants';

const CryptSearchForm = () => {
  const {
    cryptCardBase,
    searchInventoryMode,
    searchMissingInventoryMode,
    setShowCryptSearch,
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
  const { filterCrypt } = useFilters(limitedMode ? limitedCrypt : cryptCardBase);
  const [error, setError] = useState(false);
  const [preresults, setPreresults] = useState();
  const showLimit = 300;
  const navigate = useNavigate();
  const query = JSON.parse(new URLSearchParams(useLocation().search).get('q'));

  useEffect(() => {
    if (query) {
      Object.keys(query).forEach((i) => {
        if (typeof query[i] === 'object') {
          Object.keys(query[i]).forEach((j) => {
            searchCryptForm[i][j] = query[i][j];
          });
        } else {
          searchCryptForm[i] = query[i];
        }
      });
    }
  }, []);

  const handleTextChange = (formId, value) => {
    searchCryptForm.text[formId].value = value;
  };

  const handleTextCheckboxesChange = (event) => {
    const { name, value } = event.currentTarget;
    if (['name', 'text'].includes(value)) {
      searchCryptForm.text[name]['in'] = searchCryptForm.text[name]['in'] === value ? false : value;
    } else {
      searchCryptForm.text[name][value] = !searchCryptForm.text[name][value];
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event;
    searchCryptForm[name] = value;
  };

  const handleMultiSelectChange = (event, id) => {
    const i = id.name;
    const { name, value } = event;

    if (['capacity'].includes(name)) {
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
      searchCryptForm[name]['age'] = searchCryptForm[name]['age'] === value ? false : value;
    } else if ([ONLY, FIRST, REPRINT].includes(value)) {
      searchCryptForm[name][PRINT] = searchCryptForm[name][PRINT] === value ? false : value;
    } else {
      searchCryptForm[name][value] = !searchCryptForm[name][value];
    }
  };

  const handleDisciplinesChange = (name, max) => {
    if (cryptFormState.disciplines[name] < max) {
      searchCryptForm.disciplines[name] += 1;
    } else {
      searchCryptForm.disciplines[name] = 0;
    }
  };

  const handleClear = () => {
    clearSearchForm(CRYPT);
    setCryptResults(undefined);
    setPreresults(undefined);
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
    navigate(`/crypt?q=${encodeURIComponent(JSON.stringify(sanitizedForm))}`);

    const filteredCards = filterCrypt(sanitizedForm).filter(
      (card) => playtestMode || card.Id < 210000,
    );

    const setResults = isMobile ? setCryptResults : setPreresults;
    if (searchInventoryMode && inventoryMode) {
      setResults(
        filteredCards.filter((card) => {
          return inventoryCrypt[card.Id] || usedCrypt.soft[card.Id] || usedCrypt.hard[card.Id];
        }),
      );
    } else if (searchMissingInventoryMode && inventoryMode) {
      setResults(filteredCards.filter((card) => !inventoryCrypt[card.Id]?.q));
    } else {
      setResults(filteredCards);
    }
    if (isMobile) {
      if (filteredCards.length == 0) {
        navigate('/crypt');
        setError('NO CARDS FOUND');
      } else {
        setShowCryptSearch(false);
      }
    }
  };

  useEffect(() => {
    if (isMobile && query && cryptFormState && cryptCardBase) {
      processSearch();
    }
  }, [cryptFormState, cryptCardBase]);

  const testInputsAndSearch = () => {
    if (!isMobile && cryptCardBase) {
      const input = sanitizeFormState(CRYPT, cryptFormState);
      if (Object.keys(input).length === 0) {
        if (query) {
          setCryptResults(undefined);
          setPreresults(undefined);
          navigate('/crypt');
        }
      } else if (!cryptFormState.text[0].value || cryptFormState.text[0].value.length > 2) {
        processSearch();
      }
    }
  };

  useEffect(
    () => testInputsAndSearch(),
    [
      cryptFormState.text,
      cryptFormState.artist,
      cryptFormState.capacity,
      cryptFormState.clan,
      cryptFormState.group,
      cryptFormState.precon,
      cryptFormState.sect,
      cryptFormState.set,
      cryptFormState.titles,
      cryptFormState.traits,
      cryptFormState.votes,
      searchInventoryMode,
      searchMissingInventoryMode,
      inventoryMode,
      limitedMode,
      playtestMode,
      cryptCardBase,
    ],
  );

  useDebounce(() => testInputsAndSearch(), 300, [
    cryptFormState.disciplines,
    searchInventoryMode,
    searchMissingInventoryMode,
    inventoryMode,
    limitedMode,
    playtestMode,
    cryptCardBase,
  ]);

  useEffect(() => {
    if (!isMobile && preresults) {
      if (preresults.length <= showLimit) {
        setCryptResults(preresults);
      } else {
        setCryptResults(undefined);
      }
    }
  }, [preresults]);

  return (
    <div className="space-y-2">
      <SearchFormTextAndButtons
        value={cryptFormState.text}
        onChange={handleTextChange}
        onChangeOptions={handleTextCheckboxesChange}
        searchForm={searchCryptForm}
        handleShowResults={handleShowResults}
        handleClear={handleClear}
        preresults={preresults?.length}
        showLimit={showLimit}
      />
      <CryptSearchFormDisciplines
        value={cryptFormState.disciplines}
        onChange={handleDisciplinesChange}
      />
      <CryptSearchFormVirtues
        value={cryptFormState.disciplines}
        onChange={handleDisciplinesChange}
      />
      <CryptSearchFormCapacity
        value={cryptFormState.capacity}
        onChange={handleMultiSelectChange}
        searchForm={searchCryptForm}
      />
      <CryptSearchFormClan
        value={cryptFormState.clan}
        onChange={handleMultiSelectChange}
        searchForm={searchCryptForm}
      />
      <CryptSearchFormSect
        value={cryptFormState.sect}
        onChange={handleMultiSelectChange}
        searchForm={searchCryptForm}
      />
      <CryptSearchFormVotes value={cryptFormState.votes} onChange={handleSelectChange} />
      <CryptSearchFormTitles value={cryptFormState.titles} onChange={handleMultiChange} />
      <CryptSearchFormGroup value={cryptFormState.group} onChange={handleMultiChange} />
      <CryptSearchFormTraits value={cryptFormState.traits} onChange={handleMultiChange} />
      <SearchFormSet
        value={cryptFormState.set}
        onChange={handleMultiSelectChange}
        onChangeOptions={handleMultiChange}
        searchForm={searchCryptForm}
      />
      <SearchFormPrecon
        value={cryptFormState.precon}
        onChange={handleMultiSelectChange}
        onChangeOptions={handleMultiChange}
        searchForm={searchCryptForm}
      />
      <SearchFormArtist
        value={cryptFormState.artist}
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
