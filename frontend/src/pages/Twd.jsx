import React, { useState, useEffect } from 'react'; //
import { useSearchParams } from 'react-router';
import { useSnapshot } from 'valtio';
import { TwdResult, TwdSearchForm, ErrorMessage, FlexGapped } from '@/components';
import { useApp, searchResults, setTwdResults } from '@/context';
import { TWD } from '@/constants';

const Twd = () => {
  const { isMobile } = useApp();
  const twdResults = useSnapshot(searchResults)[TWD];
  const [error, setError] = useState();
  const [searchParams] = useSearchParams();
  const query = JSON.parse(searchParams.get('q'));

  useEffect(() => {
    if (!query) setTwdResults();
  }, [query]);

  return (
    <div className="twd-container mx-auto">
      <FlexGapped>
        {!(isMobile && (error || !twdResults)) && (
          <div className="basis-full sm:basis-7/12 lg:basis-8/12 xl:basis-9/12">
            {twdResults && <TwdResult results={twdResults} />}
            {error && <ErrorMessage sticky>{error}</ErrorMessage>}
          </div>
        )}
        {!(isMobile && twdResults) && (
          <div className="basis-full max-sm:p-2 sm:basis-5/12 lg:basis-4/12 xl:basis-3/12">
            <TwdSearchForm error={error} setError={setError} />
          </div>
        )}
      </FlexGapped>
    </div>
  );
};

export default Twd;
