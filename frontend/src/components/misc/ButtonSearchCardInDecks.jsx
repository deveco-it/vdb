import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components';
import PeopleFill from '@icons/people-fill.svg?react';
import TrophyFill from '@icons/trophy-fill.svg?react';
import {
  clearSearchForm,
  setTwdResults,
  setPdaResults,
  searchTwdForm,
  searchPdaForm,
} from '@/context';
import { CRYPT, LIBRARY, PDA, GT } from '@/constants';

const ButtonSearchCardInDecks = ({ cardid, target, handleClose }) => {
  const navigate = useNavigate();
  const value = { [cardid]: { q: 1, m: GT } };
  const searchForm = target == PDA ? searchPdaForm : searchTwdForm;
  const setResults = target == PDA ? setPdaResults : setTwdResults;

  const handleClick = () => {
    clearSearchForm(target);
    searchForm[cardid > 200000 ? CRYPT : LIBRARY] = value;
    setResults();
    navigate(
      `/${target}?q={"${
        cardid > 200000 ? CRYPT : LIBRARY
      }"%3A{"${cardid}"%3A{"q"%3A1%2C"m"%3A"gt"}}}`,
    );

    handleClose && handleClose();
  };

  return (
    <Button title={`Search in ${target.toUpperCase()}`} onClick={handleClick}>
      {target === PDA ? <PeopleFill /> : <TrophyFill />}
    </Button>
  );
};

export default ButtonSearchCardInDecks;
