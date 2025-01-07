import React from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import PersonFill from '@icons/person-fill.svg?react';
import TagFill from '@icons/tag-fill.svg?react';
import CalendarEvent from '@icons/calendar-event.svg?react';
import { TwdResultTags, TwdResultDescriptionTextTr } from '@/components';
import { useApp, searchPdaForm, clearSearchForm } from '@/context';
import { SUPERIOR, BASE, TAGS, AUTHOR, NAME, CREATION_DATE, TIMESTAMP, PDA } from '@/constants';

const PdaResultDescriptionText = ({ deck }) => {
  const { isMobile } = useApp();
  const navigate = useNavigate();
  const lastUpdated = dayjs(deck[TIMESTAMP]).format('YYYY');

  const handleClick = (value) => {
    clearSearchForm(PDA);
    searchPdaForm[AUTHOR] = value;
    navigate(`/pda?q=${encodeURIComponent(JSON.stringify({ [AUTHOR]: value }))}`);
  };

  return (
    <>
      <table>
        <tbody>
          <TwdResultDescriptionTextTr title={isMobile ? <TagFill /> : <>Deck:</>}>
            {deck[NAME]}
          </TwdResultDescriptionTextTr>
          <TwdResultDescriptionTextTr title={isMobile ? <PersonFill /> : <>Author:</>}>
            <div
              className="text-fgSecondary hover:underline dark:text-fgSecondaryDark"
              onClick={() => handleClick(deck[AUTHOR])}
            >
              {deck[AUTHOR]}
            </div>
          </TwdResultDescriptionTextTr>
          <TwdResultDescriptionTextTr title={isMobile ? <CalendarEvent /> : <>Created:</>}>
            {deck[CREATION_DATE]}
          </TwdResultDescriptionTextTr>
          {lastUpdated !== deck[CREATION_DATE] && (
            <TwdResultDescriptionTextTr title={isMobile ? <CalendarEvent /> : <>Updated:</>}>
              {lastUpdated}
            </TwdResultDescriptionTextTr>
          )}
        </tbody>
      </table>
      {(deck[TAGS][SUPERIOR].length > 0 || deck[TAGS][BASE].length > 0) && (
        <TwdResultTags tags={deck[TAGS]} />
      )}
    </>
  );
};

export default PdaResultDescriptionText;
