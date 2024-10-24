import React, { useState, useEffect } from 'react';
import ky from 'ky';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import {
  AnalyzeLoadCustomButtons,
  AnalyzeLoadPreparedButtons,
  AnalyzeTournamentInfo,
  AnalyzeTournamentCharts,
  AnalyzeTournamentResult,
  AnalyzeSearchForm,
  ButtonClose,
  ButtonFloatClose,
  ErrorMessage,
  FlexGapped,
  Header,
} from '@/components';
import {
  analyzeStore,
  clearAnalyzeForm,
  setAnalyzeDecks,
  setAnalyzeInfo,
  setAnalyzeResults,
  useApp,
} from '@/context';
import { useDeckImport, useTags } from '@/hooks';
import { DECKS, RESULTS, INFO } from '@/utils/constants';

const TournamentAnalyze = () => {
  const { username, cryptCardBase, libraryCardBase, isMobile, isDesktop } = useApp();
  const { [DECKS]: decks, [RESULTS]: results, [INFO]: info } = useSnapshot(analyzeStore);
  const params = useParams();
  const navigate = useNavigate();

  const [tempDecks, setTempDecks] = useState();
  const [tempArchon, setTempArchon] = useState();
  const [error, setError] = useState(false);

  const getDeck = async (data) => {
    const deck = await useDeckImport(data, cryptCardBase, libraryCardBase);
    deck.tags = await useTags(deck.crypt, deck.library);
    return deck;
  };

  const loadPrepared = async (id) => {
    const { default: JSZip } = await import('jszip');
    setError(false);

    const url = `${import.meta.env.VITE_BASE_URL}/tournaments/${id}.zip`;

    ky.get(url)
      .then(function (response) {
        if (response.status === 200 || response.status === 0) {
          return Promise.resolve(response.blob());
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      })
      .then(JSZip.loadAsync)
      .then((zip) => {
        Object.values(zip.files).forEach(async (f) => {
          if (f.name.includes('.xlsx')) {
            const archon = await f.async('base64');
            setTempArchon(archon);
          }
        });

        const decks = Object.values(zip.files)
          .filter((f) => !f.name.includes('.xlsx'))
          .map(async (f) => {
            const d = await f.async('string');
            return getDeck(d);
          });

        Promise.all(decks).then((v) => {
          const d = {};
          v.forEach((i) => {
            d[parseInt(i.author)] = i;
          });

          setTempDecks(d);
        });
      })
      .catch(() => setError(id));
  };

  const loadArchon = async (file) => {
    const { read, utils } = await import('xlsx');
    const wb = read(file);

    const wsInfo = wb.Sheets['Tournament Info'];
    const dataInfo = utils.sheet_to_csv(wsInfo).split('\n');
    const wsScores = wb.Sheets['Methuselahs'];
    const dataScores = utils.sheet_to_csv(wsScores).split('\n');

    const getFinalPlace = (playerNumber) => {
      const wsFinalTable = wb.Sheets['Final Round'];
      const dataFinalTable = utils.sheet_to_csv(wsFinalTable).split('\n');
      const finalPlace = dataFinalTable
        .filter((i) => {
          const array = i.split(',');
          return parseInt(array[0]) == playerNumber && array[21];
        })[0]
        .split(',')[21];
      return parseInt(finalPlace);
    };

    let totalPlayers = 0;
    let totalRounds = 0;
    let totalMatches = 0;
    let totalGw = 0;
    let totalVp = 0;
    let medianVp = 0;
    let medianGw = 0;
    let reportedRanks = [];
    let event;
    let date;
    let location;

    dataInfo.forEach((n) => {
      const array = n.split(',');
      if (array[0] === 'Number of Players:') totalPlayers = array[1];
      if (array[0] === 'Number of Rounds (including final):') totalRounds = array[1];
      if (array[0] === 'Number of Event Matches:') totalMatches = array[1];
      if (array[0] === 'Event Name:') event = array[1];
      if (array[0] === 'Event Date (DD-MON-YY):') date = array[1];
      if (array[0] === 'City:') location = array[1];
    });

    dataScores.forEach((n) => {
      const array = n.split(',');
      const veknId = parseInt(array[4]);
      const playerNumber = parseInt(array[0]);
      if (!veknId) return;

      const rank =
        array[20] == 'DQ'
          ? 'DQ'
          : parseInt(array[20]) > 5
            ? parseInt(array[20])
            : wb.Sheets['Final Round']
              ? getFinalPlace(playerNumber)
              : parseInt(array[17]);

      const name = `${array[1]} ${array[2]}`;

      const score = {
        name: name,
        rank: rank,
        gw: Number(array[7]),
        vp: Number(array[8]),
        players: totalPlayers,
      };

      if (tempDecks[veknId]) {
        reportedRanks.push(score.rank);
        tempDecks[veknId].score = score;
      }

      if (score.rank > Math.ceil(totalPlayers / 2)) {
        if (medianVp < score.vp) medianVp = score.vp;
        if (medianGw < score.gw) medianGw = score.gw;
      }
      totalGw += score.gw;
      totalVp += score.vp;
    });

    let medianReportedRank;
    reportedRanks.sort((a, b) => a > b);
    if (reportedRanks.length % 2) {
      medianReportedRank = reportedRanks[(reportedRanks.length - 1) / 2];
    } else {
      const min = reportedRanks[reportedRanks.length / 2 + 1];
      const max = reportedRanks[reportedRanks.length / 2 - 1];
      medianReportedRank = (min + max) / 2;
    }

    const info = {
      event: event,
      date: date,
      location: location,
      players: totalPlayers,
      matches: totalMatches,
      rounds: totalRounds,
      totalGw: totalGw,
      totalVp: totalVp,
      avgMatchGw: Math.round((totalGw / totalMatches) * 10) / 10,
      avgMatchVp: Math.round((totalVp / totalMatches) * 10) / 10,
      medianPlayerGw: medianGw,
      medianPlayerVp: medianVp,
      medianRank: totalPlayers / 2,
      medianReportedRank: medianReportedRank,
    };

    setAnalyzeInfo(info);
    setAnalyzeDecks(tempDecks);
  };

  const handleClear = () => {
    clearAnalyzeForm();
    setError(false);
    setTempArchon();
    setTempDecks();
    setAnalyzeInfo();
    setAnalyzeDecks();
    setAnalyzeResults();
    navigate('/tournament_analyze');
  };

  useEffect(() => {
    if (tempDecks && tempArchon) {
      loadArchon(tempArchon);
    }
  }, [tempDecks, tempArchon]);

  useEffect(() => {
    if (params.tournamentid && !(decks || info) && cryptCardBase && libraryCardBase) {
      loadPrepared(params.tournamentid);
    }
  }, [params.tournamentid, cryptCardBase, libraryCardBase]);

  return (
    <div className="twd-container mx-auto flex flex-col gap-2">
      <Header>
        <div className="flex w-full flex-col p-2 text-lg max-sm:gap-2">
          <div className="flex justify-center">
            Want more Tournaments here? Help your organizer to collect the data!
          </div>
          <div className="flex justify-center gap-1.5">
            More details:
            <a
              target="_blank"
              rel="noreferrer"
              className="underline"
              href="https://static.krcg.org/data/tournament/index.html"
            >
              EXTENDED TOURNAMENTS DECKS ARCHIVE
            </a>
          </div>
        </div>
      </Header>
      <FlexGapped className="flex-col">
        {!(info && decks) && (
          <div className="grid h-[70vh] place-items-center max-sm:px-2">
            <div className="flex flex-col gap-2">
              <AnalyzeLoadPreparedButtons
                setTempDecks={setTempDecks}
                setTempArchon={setTempArchon}
                setError={setError}
              />
              {['1', 'crauseon'].includes(username) && (
                <AnalyzeLoadCustomButtons
                  tempDecks={tempDecks}
                  setTempDecks={setTempDecks}
                  setTempArchon={setTempArchon}
                  getDeck={getDeck}
                  setError={setError}
                />
              )}
            </div>
          </div>
        )}
        <FlexGapped className="max-sm:flex-col">
          <div className="flex basis-9/12 justify-center max-sm:order-last">
            {error && (
              <div className="w-full">
                <ErrorMessage>NO DATA AVAILABLE FOR EVENT #{error}</ErrorMessage>
              </div>
            )}
            {decks && info && (
              <AnalyzeTournamentCharts info={info} decks={decks} searchResults={results ?? {}} />
            )}
          </div>
          <FlexGapped className="basis-3/12 flex-col">
            {info && decks && (
              <>
                {isDesktop ? (
                  <ButtonClose handleClick={handleClear} title="Clear Data" text="Clear" />
                ) : (
                  <ButtonFloatClose handleClose={handleClear} />
                )}
                <AnalyzeTournamentInfo info={info} decks={decks} />
              </>
            )}
          </FlexGapped>
        </FlexGapped>
        {decks && info && (
          <FlexGapped>
            <div className="flex flex-col gap-4 sm:basis-7/12 sm:p-0 lg:basis-8/12 xl:basis-9/12">
              <AnalyzeTournamentResult decks={results ?? Object.values(decks)} />
            </div>
            {!(isMobile && decks && info) && (
              <div className="basis-full p-2 sm:basis-5/12 sm:p-0 lg:basis-4/12 xl:basis-3/12">
                <AnalyzeSearchForm />
              </div>
            )}
          </FlexGapped>
        )}
      </FlexGapped>
    </div>
  );
};

export default TournamentAnalyze;
