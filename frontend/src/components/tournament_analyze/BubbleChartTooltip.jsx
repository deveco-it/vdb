import React from 'react';
import { TwdResultCryptTable, TwdResultLibraryKeyCardsTable, TwdResultTags } from '@/components';

const BubbleChartTooltip = ({ active, payload }) => {
  const value = payload?.[0]?.payload;

  return (
    <div
      className={`z-50 flex flex-col gap-0.5 rounded-md border border-bgSecondary bg-bgPrimary p-1 text-fgPrimary dark:border-bgSecondaryDark dark:bg-bgPrimaryDark dark:text-fgPrimaryDark`}
    >
      {active && (
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-fgSecondary dark:text-fgSecondaryDark">{value.clan}</div>
            <div className="flex gap-2">
              {value.tags && (value.tags.superior.length > 0 || value.tags.base.length > 0) && (
                <TwdResultTags tags={value.tags} />
              )}
              <div className="flex items-center">
                <div
                  className={`flex items-center whitespace-nowrap rounded-lg ${value.rank > 5 ? 'border border-borderPrimary dark:border-borderPrimaryDark' : 'border-2'} px-2.5 py-1 font-bold text-fgSecondary dark:text-fgSecondaryDark`}
                >
                  # {value.rank}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
            <TwdResultCryptTable crypt={value.crypt} />
            <TwdResultLibraryKeyCardsTable withHeader library={value.library} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleChartTooltip;
