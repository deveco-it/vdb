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
  LibrarySearchFormType,
  LibrarySearchFormClan,
  LibrarySearchFormTitle,
  LibrarySearchFormSect,
  LibrarySearchFormDiscipline,
  LibrarySearchFormTraits,
  LibrarySearchFormBloodCost,
  LibrarySearchFormPoolCost,
  LibrarySearchFormCapacity,
} from '@/components';
import { sanitizeFormState } from '@/utils';
import { useFilters } from '@/hooks';
import {
  useApp,
  setLibraryResults,
  searchLibraryForm,
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
  ONLY,
  PRINT,
  REPRINT,
  FIRST,
  LIBRARY,
} from '@/utils/constants';

const LibrarySearchForm = () => {
  const {
    libraryCardBase,
    searchInventoryMode,
    searchMissingInventoryMode,
    setShowLibrarySearch,
    showFloatingButtons,
    inventoryMode,
    isMobile,
    playtestMode,
    limitedMode,
  } = useApp();
  const inventoryLibrary = useSnapshot(inventoryStore).library;
  const usedLibrary = useSnapshot(usedStore).library;
  const limitedLibrary = useSnapshot(limitedStore).library;
  const libraryFormState = useSnapshot(searchLibraryForm);
  const { filterLibrary } = useFilters(limitedMode ? limitedLibrary : libraryCardBase);
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
            searchLibraryForm[i][j] = query[i][j];
          });
        } else {
          searchLibraryForm[i] = query[i];
        }
      });
    }
  }, []);

  const handleTextChange = (formId, value) => {
    searchLibraryForm.text[formId].value = value;
  };

  const handleTextCheckboxesChange = (event) => {
    const { name, value } = event.currentTarget;
    if (['name', 'text'].includes(value)) {
      searchLibraryForm.text[name]['in'] =
        searchLibraryForm.text[name]['in'] === value ? false : value;
    } else {
      searchLibraryForm.text[name][value] = !searchLibraryForm.text[name][value];
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event;
    searchLibraryForm[name] = value;
  };

  const handleMultiSelectChange = (event, id) => {
    const i = id.name;
    const { name, value } = event;

    if (['blood', 'pool', 'capacity'].includes(name)) {
      if ([LE, GE, EQ].includes(value)) {
        searchLibraryForm[name].moreless = value;
      } else {
        searchLibraryForm[name][name] = value;
      }
    } else {
      searchLibraryForm[name].value[i] = value;
    }
  };

  const handleMultiChange = (event) => {
    const { name, value } = event.target;

    if ([OR_NEWER, OR_OLDER, NOT_NEWER, NOT_OLDER].includes(value)) {
      searchLibraryForm[name]['age'] = searchLibraryForm[name]['age'] === value ? false : value;
    } else if ([ONLY, FIRST, REPRINT].includes(value)) {
      searchLibraryForm[name][PRINT] = searchLibraryForm[name][PRINT] === value ? false : value;
    } else {
      searchLibraryForm[name][value] = !searchLibraryForm[name][value];
    }
  };

  const handleClear = () => {
    clearSearchForm('library');
    setLibraryResults(undefined);
    setPreresults(undefined);
    setError(false);
  };

  const handleShowResults = () => {
    setLibraryResults(preresults);
  };

  const processSearch = () => {
    setError(false);
    const sanitizedForm = sanitizeFormState('library', libraryFormState);

    if (Object.entries(sanitizedForm).length === 0) {
      setError('EMPTY REQUEST');
      return;
    }
    navigate(`/library?q=${encodeURIComponent(JSON.stringify(sanitizedForm))}`);

    const filteredCards = filterLibrary(sanitizedForm).filter(
      (card) => playtestMode || card.Id < 110000,
    );

    const setResults = isMobile ? setLibraryResults : setPreresults;
    if (searchInventoryMode && inventoryMode) {
      setResults(
        filteredCards.filter((card) => {
          return (
            inventoryLibrary[card.Id] || usedLibrary.soft[card.Id] || usedLibrary.hard[card.Id]
          );
        }),
      );
    } else if (searchMissingInventoryMode && inventoryMode) {
      setResults(filteredCards.filter((card) => !inventoryLibrary[card.Id]?.q));
    } else {
      setResults(filteredCards);
    }
    if (isMobile) {
      if (filteredCards.length == 0) {
        navigate('/library');
        setError('NO CARDS FOUND');
      } else {
        setShowLibrarySearch(false);
      }
    }
  };

  useEffect(() => {
    if (isMobile && query && libraryFormState && libraryCardBase) {
      processSearch();
    }
  }, [libraryFormState, libraryCardBase]);

  const testInputsAndSearch = () => {
    if (!isMobile && libraryCardBase) {
      const input = sanitizeFormState('library', libraryFormState);
      if (Object.keys(input).length === 0) {
        if (query) {
          setLibraryResults(undefined);
          setPreresults(undefined);
          navigate('/library');
        }
      } else if (!libraryFormState.text[0].value || libraryFormState.text[0].value.length > 2) {
        processSearch();
      }
    }
  };

  useEffect(
    () => testInputsAndSearch(),
    [
      libraryFormState,
      searchInventoryMode,
      searchMissingInventoryMode,
      inventoryMode,
      limitedMode,
      playtestMode,
      libraryCardBase,
    ],
  );

  useEffect(() => {
    if (!isMobile && preresults) {
      if (preresults.length <= showLimit) {
        setLibraryResults(preresults);
      } else {
        setLibraryResults(undefined);
      }
    }
  }, [preresults]);

  return (
    <div className="space-y-2">
      <SearchFormTextAndButtons
        value={libraryFormState.text}
        onChange={handleTextChange}
        onChangeOptions={handleTextCheckboxesChange}
        searchForm={searchLibraryForm}
        handleShowResults={handleShowResults}
        handleClear={handleClear}
        preresults={preresults?.length}
        showLimit={showLimit}
      />
      <LibrarySearchFormType
        value={libraryFormState.type}
        onChange={handleMultiSelectChange}
        searchForm={searchLibraryForm}
      />
      <LibrarySearchFormDiscipline
        value={libraryFormState.discipline}
        onChange={handleMultiSelectChange}
        searchForm={searchLibraryForm}
      />
      <LibrarySearchFormClan
        value={libraryFormState.clan}
        onChange={handleMultiSelectChange}
        searchForm={searchLibraryForm}
      />
      <LibrarySearchFormSect
        value={libraryFormState.sect}
        onChange={handleMultiSelectChange}
        searchForm={searchLibraryForm}
      />
      <LibrarySearchFormTitle
        value={libraryFormState.title}
        onChange={handleMultiSelectChange}
        searchForm={searchLibraryForm}
      />
      <LibrarySearchFormBloodCost
        value={libraryFormState.blood}
        onChange={handleMultiSelectChange}
      />
      <LibrarySearchFormPoolCost value={libraryFormState.pool} onChange={handleMultiSelectChange} />
      <LibrarySearchFormCapacity
        value={libraryFormState.capacity}
        onChange={handleMultiSelectChange}
      />
      <LibrarySearchFormTraits value={libraryFormState.traits} onChange={handleMultiChange} />
      <SearchFormSet
        value={libraryFormState.set}
        onChange={handleMultiSelectChange}
        onChangeOptions={handleMultiChange}
        searchForm={searchLibraryForm}
      />
      <SearchFormPrecon
        value={libraryFormState.precon}
        onChange={handleMultiSelectChange}
        onChangeOptions={handleMultiChange}
        searchForm={searchLibraryForm}
      />
      <SearchFormArtist
        value={libraryFormState.artist}
        onChange={handleSelectChange}
        target={LIBRARY}
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

export default LibrarySearchForm;
