import React from 'react';
import { twMerge } from 'tailwind-merge';
import HourglassSplit from '@/assets/images/icons/hourglass-split.svg?react';
import LightningChargeFill from '@/assets/images/icons/lightning-charge-fill.svg?react';
import Hammer from '@/assets/images/icons/hammer.svg?react';
import Exclamation from '@/assets/images/icons/exclamation-triangle.svg?react';
import { BANNED, LEGAL, PLAYTEST } from '@/constants';

const ResultLegalIcon = ({ value, type = 'default', className }) => {
  const title = {
    [PLAYTEST]: 'Playtest',
    [BANNED]: `Banned in ${value}`,
    [LEGAL]: `Not Tournament Legal until ${value}`,
  };

  const icons = {
    [PLAYTEST]: (
      <LightningChargeFill className="inline" width="15" height="15" viewBox="0 0 16 16" />
    ),
    [BANNED]: <Hammer className="inline" width="15" height="15" viewBox="0 0 16 16" />,
    [LEGAL]: <HourglassSplit className="inline" width="14" height="14" viewBox="0 0 16 16" />,
  };

  return (
    <div
      className={twMerge(
        'inline-flex items-center whitespace-nowrap text-fgRed dark:text-fgRedDark',
        className,
      )}
      title={title[type] ?? ''}
    >
      {icons[type] ?? <Exclamation width="15" height="15" viewBox="0 0 16 16" />}
    </div>
  );
};

export default ResultLegalIcon;
