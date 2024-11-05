import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import {
  ButtonFloatSearch,
  ButtonFloatClose,
  Checkbox,
  TwdSearchFormButtons,
  TwdSearchFormCapacity,
  TwdSearchFormCardtypes,
  CryptSearchFormClan,
  CryptSearchFormSect,
  TwdSearchFormCrypt,
  TwdSearchFormDate,
  TwdSearchFormDisciplines,
  TwdSearchFormEvent,
  TwdSearchFormLibrary,
  TwdSearchFormLibraryTotal,
  TwdSearchFormLocation,
  TwdSearchFormMatchInventory,
  TwdSearchFormPlayer,
  TwdSearchFormPlayers,
} from '@/components';
import { sanitizeFormState } from '@/utils';
import { useApp, setTwdResults, searchTwdForm, clearSearchForm } from '@/context';
import { archiveServices } from '@/services';
import { TWD, CRYPT, LIBRARY } from '@/constants';

const TwdSearchForm = ({ error, setError }) => {
  const { cryptCardBase, libraryCardBase, showFloatingButtons, inventoryMode, isMobile } = useApp();
  const twdFormState = useSnapshot(searchTwdForm);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const query = JSON.parse(new URLSearchParams(useLocation().search).get('q'));

  useEffect(() => {
    if (query) {
      Object.keys(query).forEach((i) => {
        if (typeof query[i] === 'object') {
          Object.keys(query[i]).forEach((j) => {
            searchTwdForm[i][j] = query[i][j];
          });
        } else {
          searchTwdForm[i] = query[i];
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isMobile && query && twdFormState && cryptCardBase && libraryCardBase) {
      processSearch();
    }
  }, [twdFormState, cryptCardBase, libraryCardBase]);

  const handleEventChange = (event) => {
    searchTwdForm.event = event.target.value;
  };

  const handleMultiSelectChange = (event, id) => {
    const i = id.name;
    const { name, value } = event;
    searchTwdForm[name].value[i] = value;
  };

  const handleChangeWithOpt = (event, id) => {
    const i = id.name;
    const { name, value } = event;
    searchTwdForm[i][name] = value;
  };

  const handleDisciplinesChange = (name) => {
    searchTwdForm.disciplines[name] = !twdFormState.disciplines[name];
  };

  const handleMultiChange = (event) => {
    const { name, value } = event.target;
    searchTwdForm[name][value] = !twdFormState[name][value];
  };

  const handleMatchInventoryScalingChange = (e) => {
    if (e.target.checked) {
      searchTwdForm.matchInventory.scaling = e.target.name;
    } else {
      searchTwdForm.matchInventory.scaling = false;
    }
  };

  const handleClear = () => {
    clearSearchForm(TWD);
    setTwdResults(undefined);
    setError(false);
  };

  const handleError = (e) => {
    switch (e.response.status) {
      case 400:
        setError('NO DECKS FOUND');
        break;
      default:
        setError('CONNECTION PROBLEM');
    }

    setTwdResults(null);
    if (isMobile) {
      setIsLoading(false);
      navigate('/twd');
    }
  };

  const processSearch = () => {
    setError(false);
    const sanitizedForm = sanitizeFormState(TWD, twdFormState);
    if (Object.entries(sanitizedForm).length === 0) {
      setError('EMPTY REQUEST');
      return;
    }
    navigate(`/twd?q=${encodeURIComponent(JSON.stringify(sanitizedForm))}`);

    setIsLoading(true);
    archiveServices
      .search(sanitizedForm)
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  };

  const getNewTwd = (q) => {
    setError(false);
    clearSearchForm(TWD);

    setIsLoading(true);
    archiveServices
      .getNewDecks(q)
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  };

  const getRandomTwd = (q) => {
    setError(false);
    clearSearchForm(TWD);

    setIsLoading(true);
    archiveServices
      .getRandomDecks(q)
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isMobile && cryptCardBase && libraryCardBase) {
      const sanitizedForm = sanitizeFormState(TWD, twdFormState);
      if (Object.keys(sanitizedForm).length === 0) {
        if (query) {
          setTwdResults(undefined);
          navigate('/twd');
        }
      } else if (!twdFormState.event || twdFormState.event.length > 2) {
        processSearch();
      }
    }
  }, [twdFormState, cryptCardBase, libraryCardBase]);

  return (
    <div className="flex flex-col gap-2">
      <TwdSearchFormButtons handleClear={handleClear} getNew={getNewTwd} getRandom={getRandomTwd} />
      {inventoryMode && (
        <>
          <TwdSearchFormMatchInventory
            value={twdFormState.matchInventory.crypt}
            target={CRYPT}
            onChange={handleChangeWithOpt}
          />
          <TwdSearchFormMatchInventory
            value={twdFormState.matchInventory.library}
            target={LIBRARY}
            onChange={handleChangeWithOpt}
          />
          <div className="flex justify-end gap-6">
            <Checkbox
              name="60"
              label="Scale to 60 cards"
              checked={twdFormState.matchInventory.scaling == 60}
              value={twdFormState.matchInventory.scaling}
              onChange={handleMatchInventoryScalingChange}
            />
            <Checkbox
              name="75"
              label="Scale to 75 cards"
              checked={twdFormState.matchInventory.scaling == 75}
              value={twdFormState.matchInventory.scaling}
              onChange={handleMatchInventoryScalingChange}
            />
          </div>
        </>
      )}
      <TwdSearchFormDate value={twdFormState.date} onChange={handleChangeWithOpt} />
      <TwdSearchFormPlayers value={twdFormState.players} onChange={handleChangeWithOpt} />
      {cryptCardBase && (
        <TwdSearchFormCrypt value={twdFormState.crypt} form={searchTwdForm.crypt} />
      )}
      <div className="flex justify-end">
        <Checkbox
          name="traits"
          value="star"
          label="With Star"
          checked={twdFormState.traits.star}
          onChange={handleMultiChange}
        />
      </div>
      {libraryCardBase && (
        <TwdSearchFormLibrary value={twdFormState.library} form={searchTwdForm.library} />
      )}
      <TwdSearchFormLibraryTotal value={twdFormState.libraryTotal} onChange={handleMultiChange} />
      <CryptSearchFormClan
        value={twdFormState.clan}
        onChange={handleMultiSelectChange}
        searchForm={searchTwdForm}
      />
      <div className="flex justify-end">
        <Checkbox
          name="traits"
          value="monoclan"
          label="Mono Clan"
          checked={twdFormState.traits.monoclan}
          onChange={handleMultiChange}
        />
      </div>
      <CryptSearchFormSect
        value={twdFormState.sect}
        onChange={handleMultiSelectChange}
        searchForm={searchTwdForm}
      />
      <TwdSearchFormCapacity value={twdFormState.capacity} onChange={handleMultiChange} />
      <TwdSearchFormDisciplines
        value={twdFormState.disciplines}
        onChange={handleDisciplinesChange}
      />
      <TwdSearchFormCardtypes value={twdFormState.cardtypes} onChange={handleChangeWithOpt} />
      <TwdSearchFormEvent value={twdFormState.event} onChange={handleEventChange} />
      <TwdSearchFormLocation value={twdFormState.location} form={searchTwdForm} />
      <TwdSearchFormPlayer value={twdFormState.author} form={searchTwdForm} />
      {isMobile && showFloatingButtons && (
        <>
          <ButtonFloatClose handleClose={handleClear} position="middle" />
          <ButtonFloatSearch handleSearch={processSearch} error={error} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default TwdSearchForm;
