import React from 'react';
import GiftFill from '@icons/gift-fill.svg?react';
import { ResultLibraryClan } from '@/components';

const ResultPreconClan = ({ clan }) => {
  return (
    <>
      {clan === 'Bundle' ? (
        <div className="flex h-[21px] items-center dark:brightness-[0.65] sm:h-[24px]">
          <GiftFill />
        </div>
      ) : clan === 'Mix' ? null : (
        <ResultLibraryClan value={clan} />
      )}
    </>
  );
};

export default ResultPreconClan;
