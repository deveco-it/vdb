import React from 'react';
import { useDeckCrypt, useDeckLibrary, useFetch } from '@/hooks';

const getDateWithSuffix = (d) => {
  if (!d) return;
  const date = d.replace(/^0/, '');

  if (date > 20 || date < 10) {
    switch (date % 10) {
      case 1:
        return `${date}st`;
      case 2:
        return `${date}nd`;
      case 3:
        return `${date}rd`;
    }
  }
  return `${date}th`;
};

const TwdCheckEvent = ({ deckData }) => {
  const urlCountries = `${import.meta.env.VITE_API_URL}/twd/countries`;
  const urlCities = `${import.meta.env.VITE_API_URL}/twd/cities`;
  const { value: countries } = useFetch(urlCountries, {}, []);
  const { value: cities } = useFetch(urlCities, {}, []);

  const url = `${import.meta.env.VITE_API_URL}/twd/event/${deckData.id}`;
  const { value } = useFetch(url, {}, [deckData.id]);

  const countriesFixes = {
    AT: 'Austria',
    AU: 'Australia',
    BE: 'Belgium',
    BR: 'Brazil',
    BY: 'Belarus',
    CA: 'Canada',
    CH: 'Switzerland',
    CL: 'Chile',
    CZ: 'Czech Republic',
    DE: 'Germany',
    DK: 'Denmark',
    ES: 'Spain',
    FI: 'Finland',
    FR: 'France',
    GB: 'United Kingdom',
    GR: 'Greece',
    HR: 'Croatia',
    HU: 'Hungary',
    IE: 'Ireland',
    IS: 'Iceland',
    IT: 'Italy',
    JP: 'Japan',
    LT: 'Lithuania',
    MX: 'Mexico',
    NL: 'Netherlands',
    NO: 'Norway',
    ONLINE: 'Online',
    PH: 'Philipines',
    PL: 'Poland',
    PT: 'Portugal',
    RS: 'Serbia',
    RU: 'Russia',
    SE: 'Sweden',
    SG: 'Singapore',
    SK: 'Slovakia',
    US: 'USA',
    ZA: 'South Africa',
  };

  const country = countriesFixes[value?.venue_country] ?? value?.venue_country;
  const city = value?.venue_city;
  const venue = value?.venue_name;

  let location = country ? `${city}, ${country}` : 'Unknown';
  if (venue) location = `${venue}, ${location}`;

  const [year, m, d] = value?.event_enddate.split('-') || [];

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = monthNames[m - 1];
  const day = getDateWithSuffix(d);
  const date = `${month} ${day} ${year}`;

  const veknEvent = {
    name: value?.event_name,
    format: value?.rounds,
    location: location,
    date: date,
    players: `${value?.attendance} players`,
    url: `https://www.vekn.net/event-calendar/event/${value?.event_id}`,
  };

  const {
    hasWrongGroups,
    hasBanned: cryptHasBanned,
    cryptTotal,
  } = useDeckCrypt(deckData.deck[CRYPT]);

  const { hasBanned: libraryHasBanned, libraryTotal } = useDeckLibrary(deckData.deck[LIBRARY]);

  const cryptQtyError = cryptTotal < 12;
  const libraryQtyError = libraryTotal > 90 || libraryTotal < 60;

  const deckLocation = deckData[LOCATION].split(', ');
  const deckCountry = deckLocation.at(-1);
  const deckCity = deckLocation.at(-2);
  const isUniqueCity = deckCity && cities && !cities.includes(`${deckCity}, ${deckCountry}`);
  const isUniqueCountry = countries && !countries.includes(deckCountry);

  return (
    <>
      {value && value.event_id === deckData.id ? (
        <div className="pt-[5px] font-mono text-sm">
          <div className={deckData[EVENT] === veknEvent[NAME] ? '' : 'underline decoration-fgRed'}>
            {veknEvent[NAME]}
          </div>
          <div
            className={
              deckData[LOCATION] === veknEvent[LOCATION] ? '' : 'underline decoration-fgRed'
            }
          >
            {veknEvent[LOCATION]}
          </div>
          <div className={deckData[DATE] === veknEvent[DATE] ? '' : 'underline decoration-fgRed'}>
            {veknEvent[DATE]}
          </div>
          <div className={deckData.format === veknEvent.format ? '' : 'underline decoration-fgRed'}>
            {veknEvent.format}
          </div>
          <div
            className={deckData.players === veknEvent.players ? '' : 'underline decoration-fgRed'}
          >
            {veknEvent.players}
          </div>
          <br />
          <div>
            <a
              className={deckData.url === veknEvent.url ? '' : 'underline decoration-fgRed'}
              href={veknEvent.url}
              rel="noreferrer"
              target="_blank"
            >
              {veknEvent.url}
            </a>
          </div>
          <br />
          <div className="flex flex-col gap-3">
            {hasWrongGroups && (
              <div className="text-fgRed dark:text-fgRedDark">Crypt has non-matching groups</div>
            )}
            {cryptQtyError && (
              <div className="text-fgRed dark:text-fgRedDark">Crypt has &lt;12 cards</div>
            )}
            {libraryQtyError && (
              <div className="text-fgRed dark:text-fgRedDark">
                Library has &lt;60 or &gt;90 cards
              </div>
            )}

            {cryptHasBanned && (
              <div className="text-fgRed dark:text-fgRedDark">Crypt has banned cards</div>
            )}
            {libraryHasBanned && (
              <div className="text-fgRed dark:text-fgRedDark">Library has banned cards</div>
            )}
            {isUniqueCity && (
              <div className="text-fgRed dark:text-fgRedDark">
                City never appear in TWDA before. Spelling is correct?
              </div>
            )}
            {isUniqueCountry && (
              <div className="text-fgRed dark:text-fgRedDark">
                Country never appear in TWDA before. Spelling is correct?
              </div>
            )}
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default TwdCheckEvent;
