import React, { useState } from 'react';
import ky from 'ky';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import Download from '@/assets/images/icons/download.svg?react';
import Arrow90DegLeft from '@/assets/images/icons/arrow-90deg-left.svg?react';
import {
  TabButton,
  ButtonIconed,
  FlexGapped,
  Hr,
  PlaytestReportsAllCardsWrapper,
  PlaytestReportsAllPreconsWrapper,
  PlaytestReportsAllGeneral,
  SortButton,
  Toggle,
} from '@/components';
import { useFetch } from '@/hooks';
import { useApp } from '@/context';
import { playtestServices } from '@/services';
import { capitalize } from '@/utils';
import {
  ALL,
  CARDS,
  CLAN_DISCIPLINE,
  CRYPT,
  GENERAL,
  LIBRARY,
  NAME,
  PRECONS,
  XLSX,
  LANG,
} from '@/utils/constants';

const PlaytestReportsAll = () => {
  const {
    hidePlaytestNames,
    setHidePlaytestNames,
    isPlaytestAdmin,
    preconDecks,
    cryptCardBase,
    libraryCardBase,
  } = useApp();
  const params = useParams();
  const lang = params[LANG];
  const navigate = useNavigate();
  const [sortMethod, setSortMethod] = useState(NAME);
  const sortMethods = {
    [NAME]: 'N',
    [CLAN_DISCIPLINE]: 'C/D',
  };

  const exportReports = async (target, format) => {
    let file;
    let exportText = '';

    switch (format) {
      case XLSX: {
        const urlUsers = `${import.meta.env.VITE_API_URL}/playtest/users`;
        const users = await ky(urlUsers).json();
        const data = await playtestServices.exportXlsx(
          reports,
          users,
          cryptCardBase,
          libraryCardBase,
          preconDecks,
        );
        file = new File([data], `${target}.xlsx`, {
          type: 'application/octet-stream',
        });
        break;
      }
      default:
        Object.keys(reports).forEach((id, idx) => {
          let name;
          switch (target) {
            case PRECONS:
              if (id == GENERAL || !isNaN(id)) return;
              name = preconDecks[`PLAYTEST:${id}`].name;
              exportText += `Precon: ${name}\n\n`;
              break;
            case CARDS:
              if (isNaN(id)) return;
              try {
                name = id > 200000 ? cryptCardBase[id].Name : libraryCardBase[id].Name;
              } catch {
                console.log(`Skipping (not in this Round) - ${id}`);
                break;
              }
              exportText += `${id > 200000 ? 'Crypt' : 'Library'}: ${name}\n\n`;
              break;
            default:
              if (id != GENERAL) return;
              exportText += 'General Opinions\n\n';
          }

          Object.keys(reports[id]).forEach((user, uIdx) => {
            exportText += `User: <${user}>\n`;
            switch (target) {
              case GENERAL:
                if (reports[id][user]) exportText += `${reports[id][user]}\n`;
                break;
              default:
                exportText += `Score: ${reports[id][user].score}\n`;
                exportText += `Seen in Play: ${reports[id][user].isPlayed ? 'Yes' : 'No'}\n`;
                if (reports[id][user].text) exportText += `${reports[id][user].text}\n`;
            }
            if (uIdx + 1 < Object.keys(reports[id]).length) {
              exportText += '\n-----\n\n';
            }
          });
          if (idx + 1 < Object.keys(reports).length) {
            exportText += '\n=====\n\n';
          }
        });

        file = new File([exportText], `Reports - ${capitalize(target)}.txt`, {
          type: 'text/plain;charset=utf-8',
        });
    }

    let { saveAs } = await import('file-saver');
    saveAs(file);
  };

  const urlReports = `${import.meta.env.VITE_API_URL}/playtest/export/all/${lang}`;
  const { value: reports } = useFetch(urlReports, {}, [isPlaytestAdmin]);

  const maxReportsSameScore =
    reports &&
    Object.entries(reports).reduce(
      (acc, value) => {
        const scoresDistribution = Object.values(value[1]).reduce((acc2, value2) => {
          acc2[value2.score - 1] += 1;
          return acc2;
        }, Array(10).fill(0));

        const maxSameScore = Math.max.apply(Math, scoresDistribution);

        if (isNaN(value[0])) {
          return {
            cards: acc.cards,
            precons: maxSameScore > acc.precons ? maxSameScore : acc.precons,
          };
        } else {
          return {
            cards: maxSameScore > acc.cards ? maxSameScore : acc.cards,
            precons: acc.precons,
          };
        }
      },
      { cards: 0, precons: 0 },
    );

  return (
    <div className="playtest-reports-container mx-auto">
      <div className="flex flex-col gap-3 max-sm:p-2 sm:gap-4">
        <div className="flex justify-between gap-1 sm:gap-4 print:hidden">
          <div className="flex justify-between gap-1 max-sm:w-full max-sm:flex-col sm:gap-4">
            <ButtonIconed
              className="w-full whitespace-nowrap"
              onClick={() => exportReports(PRECONS)}
              title="Precons - Text"
              text="Precons - Text"
              icon={<Download />}
            />
            <ButtonIconed
              className="w-full whitespace-nowrap"
              onClick={() => exportReports(CARDS)}
              title="Cards - Text"
              text="Cards - Text"
              icon={<Download />}
            />
            <ButtonIconed
              className="w-full whitespace-nowrap"
              onClick={() => exportReports(GENERAL)}
              title="General - Text"
              text="General - Text"
              icon={<Download />}
            />
            <ButtonIconed
              className="w-full whitespace-nowrap"
              onClick={() => exportReports(ALL, XLSX)}
              title="Excel"
              text="Excel"
              icon={<Download />}
            />
          </div>
          <div className="flex justify-between gap-1 max-sm:flex-col sm:gap-4">
            <ButtonIconed
              onClick={() => navigate('/playtest')}
              title="Back"
              icon={<Arrow90DegLeft />}
              text="Back"
            />
            <SortButton
              className="h-full min-w-[80px]"
              sortMethods={sortMethods}
              sortMethod={sortMethod}
              setSortMethod={setSortMethod}
            />
            <div className="flex justify-end">
              <Toggle
                isOn={hidePlaytestNames}
                handleClick={() => setHidePlaytestNames(!hidePlaytestNames)}
              >
                Hide Usernames
              </Toggle>
            </div>
          </div>
        </div>
        <Tab.Group manual className="flex flex-col gap-3 sm:gap-4">
          <Tab.List className="flex gap-1.5 print:hidden">
            <TabButton>Crypt</TabButton>
            <TabButton>Library</TabButton>
            <TabButton>General / Precons</TabButton>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <PlaytestReportsAllCardsWrapper
                maxSameScore={maxReportsSameScore?.cards}
                reports={reports}
                target={CRYPT}
                sortMethod={sortMethod}
              />
            </Tab.Panel>
            <Tab.Panel>
              <PlaytestReportsAllCardsWrapper
                maxSameScore={maxReportsSameScore?.cards}
                reports={reports}
                target={LIBRARY}
                sortMethod={sortMethod}
              />
            </Tab.Panel>
            <Tab.Panel>
              <FlexGapped className="flex-col">
                <PlaytestReportsAllGeneral reports={reports} />
                <Hr isThick className="print:hidden" />
                <PlaytestReportsAllPreconsWrapper
                  reports={reports}
                  maxSameScore={maxReportsSameScore?.precons}
                />
              </FlexGapped>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default PlaytestReportsAll;
