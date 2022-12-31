import React from 'react';
import { Button } from 'components';
import X from 'assets/images/icons/x.svg';
import InfoCircle from 'assets/images/icons/info-circle.svg';
import { ANY } from 'utils/constants';
import { SortButton } from 'components';
import { setCryptCompare } from 'context';

const ResultCryptTotal = ({
  cards,
  sortMethods,
  sortMethod,
  setSortMethod,
  toggleShowInfo,
  inCompare,
  inHoF,
}) => {
  const byGroups = {};
  const byGroupsCapacityTotal = {};
  let total = 0;

  cards.map((card) => {
    if (byGroups[card.Group]) {
      byGroups[card.Group] += 1;
    } else {
      byGroups[card.Group] = 1;
    }
    if (byGroupsCapacityTotal[card.Group]) {
      byGroupsCapacityTotal[card.Group] += card.Capacity;
    } else {
      byGroupsCapacityTotal[card.Group] = card.Capacity;
    }
    total += 1;
  });

  const totalOutput = Object.keys(byGroups).map((k) => {
    return (
      <span key={k} className="inline-block whitespace-nowrap ">
        <span className="font-bold text-fgSecondary dark:text-fgSecondaryDark">
          G{k == ANY ? 'X' : k}:
        </span>
        {byGroups[k]}
        {!inHoF && (
          <div className="flex justify-center text-xs" title="Average Capacity">
            ~{Math.round((byGroupsCapacityTotal[k] / byGroups[k]) * 10) / 10}
          </div>
        )}
      </span>
    );
  });

  const value = (
    <>
      <div className="whitespace-nowrap font-bold">
        {inHoF ? 'CRYPT' : inCompare ? 'COMPARE' : 'TOTAL'}: {total}
      </div>
      <div>{totalOutput}</div>
      <div className={inCompare ? 'flex' : ''}>
        {!inCompare ? (
          <>
            {!inHoF && (
              <div className=" flex justify-end">
                <Button
                  title="Additional Info"
                  variant="primary"
                  onClick={() => toggleShowInfo()}
                >
                  <InfoCircle />
                </Button>
              </div>
            )}
            <SortButton
              sortMethod={sortMethod}
              sortMethods={sortMethods}
              setSortMethod={setSortMethod}
            />
          </>
        ) : (
          <div>
            <Button
              title="Clear Compare"
              variant="primary"
              onClick={() => setCryptCompare(undefined)}
            >
              <X width="16" height="20" viewBox="0 0 16 16" />
            </Button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex items-center  justify-between bg-bgSecondary dark:bg-bgSecondaryDark ">
      {value}
    </div>
  );
};

export default ResultCryptTotal;
