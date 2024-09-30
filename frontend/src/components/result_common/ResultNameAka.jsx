import React from 'react';
import { AKA } from '@/utils/constants';

const ResultNameAka = ({ card }) => {
  return (
    <div className="flex whitespace-normal text-midGray dark:text-midGrayDark">aka {card[AKA]}</div>
  );
};

export default ResultNameAka;
