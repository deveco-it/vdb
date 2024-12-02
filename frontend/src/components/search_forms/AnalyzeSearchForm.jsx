import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useSnapshot } from 'valtio';
import {
  ButtonClose,
  ButtonFloatSearch,
  ButtonFloatClose,
  Checkbox,
  TwdSearchFormCapacity,
  TwdSearchFormCardtypes,
  CryptSearchFormClan,
  CryptSearchFormSect,
  TwdSearchFormCrypt,
  TwdSearchFormDisciplines,
  TwdSearchFormLibrary,
  TwdSearchFormLibraryTotal,
  AnalyzeSearchFormRank,
} from '@/components';
import { filterDecks, sanitizeFormState } from '@/utils';
import {
  useApp,
  setAnalyzeResults,
  searchAnalyzeForm,
  clearAnalyzeForm,
  analyzeStore,
} from '@/context';
import {
  ANALYZE,
  CAPACITY,
  CARDTYPES,
  CLAN,
  CRYPT,
  DECKS,
  DISCIPLINES,
  LIBRARY,
  LIBRARY_TOTAL,
  MONOCLAN,
  NAME,
  RANK,
  SECT,
  STAR,
  TRAITS,
} from '@/constants';

const AnalyzeSearchForm = () => {
  const { cryptCardBase, libraryCardBase, isMobile } = useApp();
  const analyzeFormState = useSnapshot(searchAnalyzeForm);
  const decks = useSnapshot(analyzeStore)[DECKS];
  const [error, setError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = JSON.parse(searchParams.get('q'));

  useEffect(() => {
    if (query) {
      Object.keys(query).forEach((i) => {
        searchAnalyzeForm[i] = query[i];
      });
    }
  }, []);

  useEffect(() => {
    if (!isMobile && cryptCardBase && libraryCardBase) {
      const sanitizedForm = sanitizeFormState(ANALYZE, analyzeFormState);
      if (Object.keys(sanitizedForm).length === 0) {
        if (query) setSearchParams();
      } else {
        processSearch();
      }
    } else if (isMobile && query && analyzeFormState && cryptCardBase && libraryCardBase) {
      processSearch();
    }
  }, [analyzeFormState, cryptCardBase, libraryCardBase]);

  const handleMultiSelectChange = (event, id) => {
    const i = id[NAME];
    const { name, value } = event;
    searchAnalyzeForm[name].value[i] = value;
  };

  const handleChangeWithOpt = (event, id) => {
    const i = id[NAME];
    const { name, value } = event;

    searchAnalyzeForm[i][name] = value;
  };

  const handleDisciplinesChange = (name) => {
    searchAnalyzeForm[DISCIPLINES][name] = !analyzeFormState[DISCIPLINES][name];
  };

  const handleMultiChange = (event) => {
    const { name, value } = event.target;
    searchAnalyzeForm[name][value] = !analyzeFormState[name][value];
  };

  const handleClear = () => {
    clearAnalyzeForm();
    setAnalyzeResults();
    setError(false);
  };

  const processSearch = () => {
    setError(false);
    const sanitizedForm = sanitizeFormState(ANALYZE, analyzeFormState);

    if (Object.entries(sanitizedForm).length === 0) {
      setError('EMPTY REQUEST');
      return;
    }

    const filteredDecks = filterDecks(decks, sanitizedForm);

    if (isMobile && filteredDecks.length == 0) {
      setError('NO DECKS FOUND');
      return;
    }

    setSearchParams({ q: JSON.stringify(sanitizedForm) });
    setAnalyzeResults(filteredDecks);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <AnalyzeSearchFormRank value={analyzeFormState[RANK]} onChange={handleChangeWithOpt} />
        <ButtonClose title="Clear Forms & Results" handleClick={handleClear} />
      </div>
      {cryptCardBase && (
        <TwdSearchFormCrypt value={analyzeFormState[CRYPT]} form={searchAnalyzeForm[CRYPT]} />
      )}
      <div className="flex justify-end">
        <Checkbox
          name={TRAITS}
          value={STAR}
          label="With Star"
          checked={analyzeFormState[TRAITS][STAR]}
          onChange={handleMultiChange}
        />
      </div>
      {libraryCardBase && (
        <TwdSearchFormLibrary value={analyzeFormState[LIBRARY]} form={searchAnalyzeForm[LIBRARY]} />
      )}
      <TwdSearchFormLibraryTotal
        value={analyzeFormState[LIBRARY_TOTAL]}
        onChange={handleMultiChange}
      />
      <CryptSearchFormClan
        value={analyzeFormState[CLAN]}
        onChange={handleMultiSelectChange}
        searchForm={searchAnalyzeForm}
      />
      <div className="flex justify-end">
        <Checkbox
          name={TRAITS}
          value={MONOCLAN}
          label="Mono Clan"
          checked={analyzeFormState[TRAITS][MONOCLAN]}
          onChange={handleMultiChange}
        />
      </div>
      <CryptSearchFormSect
        value={analyzeFormState[SECT]}
        onChange={handleMultiSelectChange}
        searchForm={searchAnalyzeForm}
      />
      <TwdSearchFormCapacity value={analyzeFormState[CAPACITY]} onChange={handleMultiChange} />
      <TwdSearchFormDisciplines
        value={analyzeFormState[DISCIPLINES]}
        onChange={handleDisciplinesChange}
      />
      <TwdSearchFormCardtypes value={analyzeFormState[CARDTYPES]} onChange={handleChangeWithOpt} />
      {isMobile && (
        <>
          <ButtonFloatClose handleClose={handleClear} position="middle" />
          <ButtonFloatSearch handleSearch={processSearch} error={error} />
        </>
      )}
    </div>
  );
};

export default AnalyzeSearchForm;
