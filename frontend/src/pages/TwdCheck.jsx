import React, { useState } from 'react';
import { TwdCheckInput, TwdCheckEvent } from '@/components';
import { ID } from '@/constants';

const TwdCheck = () => {
  const [deckData, setDeckData] = useState();

  return (
    <div className="search-container mx-auto">
      <div className="flex w-9/12 justify-center text-lg font-bold text-fgSecondary dark:text-fgSecondaryDark">
        Check TWD {deckData?.[ID] ? ` - Event #${deckData[ID]}` : ''}
      </div>
      <div className="flex justify-center gap-2">
        <div className="basis-full md:basis-8/12">
          <TwdCheckInput deckData={deckData} setDeckData={setDeckData} />
        </div>
        <div className="basis-full md:basis-4/12">
          {deckData?.[ID] && <TwdCheckEvent deckData={deckData} />}
        </div>
      </div>
    </div>
  );
};

export default TwdCheck;
