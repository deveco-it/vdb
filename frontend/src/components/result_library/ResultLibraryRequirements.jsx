import React from 'react';
import { ResultCryptTitle } from '@/components';
import { capitalize } from '@/utils';
import {
  CAPACITY,
  PRIMOGEN,
  PRINCE,
  JUSTICAR,
  INNER_CIRCLE,
  BARON,
  VOTE_1,
  VOTE_2,
  BISHOP,
  ARCHBISHOP,
  PRISCUS,
  CARDINAL,
  REGENT,
  MAGAJI,
  TITLED,
} from '@/constants';
import sectsOpts from '@/assets/data/sectsList.json';

const TitlesReq = ({ value }) => {
  const htmlTitle = value.map((v) => capitalize(v)).join(' or ');

  return (
    <div title={htmlTitle} className="text-fg-fgSecondary dark:text-fgSecondaryDark">
      <ResultCryptTitle value={value[0]} noTitle />
      {value.length > 1 && '+'}
    </div>
  );
};

const SectReq = ({ value }) => {
  const htmlTitle = value.map((v) => capitalize(v)).join(' or ');

  return (
    <div title={htmlTitle} className="inline text-fgGreen dark:text-fgGreenDark">
      {value.map((v) => v[0].charAt(0).toUpperCase()).join('-')}
    </div>
  );
};

const CapacityReq = ({ value }) => {
  const matches = [...value.matchAll(/capacity (\d+) or (more|less)/g)];

  return (
    <div title={capitalize(value)}>
      {matches[0][2] === 'less' ? '≤' : '≥'}
      {matches[0][1]}
    </div>
  );
};

const ResultLibraryRequirements = ({ value }) => {
  const requirements = value.split(',');
  const titlesOpts = [
    PRIMOGEN,
    PRINCE,
    JUSTICAR,
    INNER_CIRCLE,
    BARON,
    VOTE_1,
    VOTE_2,
    BISHOP,
    ARCHBISHOP,
    PRISCUS,
    CARDINAL,
    REGENT,
    MAGAJI,
    TITLED,
  ];

  const capacityReq = requirements.find((i) => i.includes(CAPACITY));
  const titleReq = requirements.filter((i) => titlesOpts.includes(i));
  const sectReq = requirements.filter((i) => sectsOpts.includes(i));

  return (
    <>
      {(capacityReq || titleReq.length > 0 || sectReq.length > 0) && (
        <div className="flex gap-1">
          {capacityReq && <CapacityReq value={capacityReq} />}
          {titleReq.length > 0 && <TitlesReq value={titleReq} />}
          {sectReq.length > 0 && (titleReq.length == 0 || titleReq[0] == 'titled') && (
            <SectReq value={sectReq} />
          )}
        </div>
      )}
    </>
  );
};

export default ResultLibraryRequirements;
