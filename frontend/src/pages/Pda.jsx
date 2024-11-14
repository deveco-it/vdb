import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { FlexGapped, PdaResult, PdaSearchForm, ErrorMessage } from '@/components';
import { useApp, searchResults, setPdaResults } from '@/context';
import { PDA } from '@/constants';

const Pda = () => {
  const { isMobile } = useApp();
  const pdaResults = useSnapshot(searchResults)[PDA];
  const [error, setError] = useState();

  return (
    <div className="twd-container mx-auto">
      <FlexGapped>
        {!(isMobile && (error || !pdaResults)) && (
          <div className="basis-full sm:basis-7/12 lg:basis-8/12 xl:basis-9/12">
            {pdaResults && <PdaResult results={pdaResults} setResults={setPdaResults} />}
            {error && <ErrorMessage sticky>{error}</ErrorMessage>}
          </div>
        )}
        {!(isMobile && pdaResults) && (
          <div className="basis-full max-sm:p-2 sm:basis-5/12 lg:basis-4/12 xl:basis-3/12">
            <PdaSearchForm error={error} setError={setError} />
          </div>
        )}
      </FlexGapped>
    </div>
  );
};

export default Pda;
