import React, { useMemo } from 'react';
import { BubbleChart } from '@/components';
import { byName, getClan } from '@/utils';
import { useApp } from '@/context';
import {
  IN_SEARCH,
  CLAN,
  SCORE,
  PLAYERS,
  RANK,
  AUTHOR,
  CRYPT,
  LIBRARY,
  MULTI,
  ANTITRIBU,
  TAGS,
  VALUE,
  INDEX,
} from '@/constants';

const AnalyzeTournamentChartsRankingClan = ({ info, decks, searchResults }) => {
  const { isMobile, isDesktop, isWide } = useApp();
  const data = useMemo(() => {
    const d = {};

    Object.values(decks).forEach((deck) => {
      const position = info[PLAYERS] - deck[SCORE][RANK];
      const inSearch = Object.values(searchResults).some((d) => d[AUTHOR] === deck[AUTHOR]);
      const clan = getClan(deck[CRYPT]) || MULTI;

      if (!d[clan]) {
        d[clan] = [];
        for (let i = 0; i < info[PLAYERS]; i++) {
          d[clan].push({ [INDEX]: -1, [VALUE]: 0, [RANK]: info[PLAYERS] - i });
        }
      }

      d[clan][position] = {
        [CLAN]: clan,
        [CRYPT]: deck[CRYPT],
        [LIBRARY]: deck[LIBRARY],
        [TAGS]: deck[TAGS],
        [IN_SEARCH]: inSearch,
        [INDEX]: -1,
        [VALUE]: 1,
        [RANK]: deck[SCORE][RANK],
      };
    });

    return d;
  }, [searchResults, decks, info]);

  return (
    <div className="flex basis-full flex-col items-center">
      {Object.keys(data)
        .toSorted(byName)
        .map((s) => {
          const clan = isMobile && s.includes(ANTITRIBU) ? `!${s.replace(` ${ANTITRIBU}`, '')}` : s;

          return (
            <BubbleChart
              key={s}
              data={data[s]}
              name={clan}
              refLine={info.medianReportedRank}
              titleWidth={isMobile || (isDesktop && !isWide) ? 105 : 160}
              width={isMobile || (isDesktop && !isWide) ? 370 : 600}
            />
          );
        })}
    </div>
  );
};

export default AnalyzeTournamentChartsRankingClan;
