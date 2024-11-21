// usage:
// npx ts-node --transpile-only scripts/reports/geocoded-cases.ts
// npx ts-node --transpile-only scripts/reports/geocoded-cases.ts 2023
// npx ts-node --transpile-only scripts/reports/geocoded-cases.ts 2017 2023

import { DateTime } from 'luxon';
import { Geocoder } from 'us-census-geocoder';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { appendFileSync, existsSync, readFileSync, unlinkSync } from 'fs';
import { chunk, pick } from 'lodash';
import { generateCsv } from '../helpers/generate-csv';
import { prepareDateFromString } from '@shared/business/utilities/DateHandler';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

const beginYear = process.argv[2] || `${DateTime.now().toObject().year}`;
const endYear =
  process.argv[3] && Number(process.argv[3]) > Number(beginYear)
    ? process.argv[3]
    : beginYear;
const timeframe = endYear !== beginYear ? `${beginYear}-${endYear}` : beginYear;

const GEOCODED_LOCATIONS_JSON = './scripts/helpers/geocoded-locations.json';
const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const OUTPUT_FILENAME = `${OUTPUT_DIR}/geocoded-cases_${timeframe}.csv`;

type locationType = {
  address: string;
  city: string;
  id: string;
  state: string;
  zip: string;
};
const geocodedLocations: { [k: string]: { lat: number; lon: number } } =
  JSON.parse(readFileSync(GEOCODED_LOCATIONS_JSON, 'utf-8'));

const getCasesInTimeframe = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<RawCase[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'Case',
                },
              },
              // In some instances, a paper case can be assigned a docket number
              // with a year that matches neither the case's receivedAt date nor
              // createdAt date. For the purposes of this report, the year we
              // care about is encoded in the sortableDocketNumber.
              {
                range: {
                  'sortableDocketNumber.N': {
                    gte: Number(`${beginYear}000000`),
                    lt: Number(`${Number(endYear) + 1}000000`),
                  },
                },
              },
            ],
          },
        },
        sort: [{ 'sortableDocketNumber.N': 'asc' }],
      },
      index: 'efcms-case',
    },
  });
  console.log(`Retrieved ${results.length} cases for ${timeframe}.`);
  return results;
};

const getLocationKey = (petitioner: TPetitioner): string | undefined => {
  if (petitioner.state && petitioner.city) {
    const state = petitioner.state.replace(/[^A-Za-z]/g, '').toLowerCase();
    const city = petitioner.city.replace(/[^A-Za-z]/g, '').toLowerCase();
    if (state.length > 0 && city.length > 0) {
      return `${state}_${city}`;
    }
  }
};

const gatherLocationsToGeocode = ({
  cases,
}: {
  cases: RawCase[];
}): locationType[] => {
  const locations: { [k: string]: locationType } = {};
  let alreadyGeocoded = 0;
  for (const aCase of cases) {
    if (aCase.petitioners[0].countryType === 'international') {
      continue;
    }
    const key = getLocationKey(aCase.petitioners[0]);
    if (!key) {
      console.error('Could not determine location key: ', aCase.petitioners[0]);
      continue;
    }
    if (key in geocodedLocations) {
      alreadyGeocoded++;
    } else {
      locations[key] = {
        address: concatAddress(aCase.petitioners[0]),
        city: aCase.petitioners[0].city,
        id: key,
        state: aCase.petitioners[0].state,
        zip: aCase.petitioners[0].postalCode,
      };
    }
  }
  console.log(`Already geocoded ${alreadyGeocoded} addresses.`);
  console.log(`Need to geocode ${Object.keys(locations).length} addresses.`);
  return Object.values(locations);
};

const geocodeLocations = async ({
  geocoder,
  locations,
}: {
  geocoder: Geocoder;
  locations: locationType[];
}): Promise<void> => {
  console.log(`Batch: geocoding ${locations.length} addresses.`);
  for (const location of locations) {
    geocoder.add(location.id, location);
  }
  const results = await geocoder.geocode();
  for (const result of results) {
    geocodedLocations[result.id] = pick(result, ['lat', 'lon']);
  }
  console.log(
    `Batch: geocoded ${results.length} of ${locations.length} addresses.`,
  );
};

const geocodeAllCases = async ({
  cases,
}: {
  cases: RawCase[];
}): Promise<void> => {
  const allLocations = gatherLocationsToGeocode({ cases });
  const locationChunks = chunk(allLocations, 10000);
  // We experience throttling if we try to submit simultaneous requests to the
  // US Census Bureau API using Promise.all() or priority queues. Thus, the
  // inefficiency of the following is intentional(ly courteous).
  const geocoder = new Geocoder();
  for (const locations of locationChunks) {
    await geocodeLocations({ geocoder, locations });
  }
  updateGeocodedLocationsFile();
};

const concatAddress = (petitioner: TPetitioner): string => {
  let address = petitioner.address1;
  if (petitioner.address2 && petitioner.address2.length > 0) {
    address += `, ${petitioner.address2}`;
  }
  if (petitioner.address3 && petitioner.address3.length > 0) {
    address += `, ${petitioner.address3}`;
  }
  return address;
};

const updateGeocodedLocationsFile = () => {
  if (existsSync(GEOCODED_LOCATIONS_JSON)) {
    unlinkSync(GEOCODED_LOCATIONS_JSON);
  }
  appendFileSync(GEOCODED_LOCATIONS_JSON, JSON.stringify(geocodedLocations));
};

const outputCsv = ({ cases }: { cases: RawCase[] }): void => {
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Year', key: 'year' },
    { header: 'Month', key: 'month' },
    { header: 'Procedure Type', key: 'procedureType' },
    { header: 'Case Type', key: 'caseType' },
    { header: 'Is Represented', key: 'represented' },
    { header: 'Suffix', key: 'suffix' },
    { header: 'Is Paper', key: 'paper' },
    { header: 'Status', key: 'status' },
    { header: 'Party Type', key: 'partyType' },
    { header: 'Contact Type', key: 'contactType' },
    { header: 'Address 1', key: 'address1' },
    { header: 'City', key: 'city' },
    { header: 'State', key: 'state' },
    { header: 'Postal Code', key: 'postalCode' },
    { header: 'Country', key: 'country' },
    { header: 'Latitude', key: 'lat' },
    { header: 'Longitude', key: 'lon' },
    { header: 'Preferred Trial City', key: 'preferredTrialCity' },
    { header: 'Calendared Trial City', key: 'trialLocation' },
  ];
  const rows = cases.map(c => ({
    ...pick(c, [
      'caseType',
      'docketNumber',
      'partyType',
      'preferredTrialCity',
      'procedureType',
      'status',
      'trialLocation',
    ]),
    ...pick(c.petitioners[0], [
      'address1',
      'city',
      'contactType',
      'postalCode',
      'state',
    ]),
    country:
      c.petitioners[0].countryType === 'domestic'
        ? 'USA'
        : c.petitioners[0].countryType,
    lat: geocodedLocations[getLocationKey(c.petitioners[0])!]?.lat ?? '',
    lon: geocodedLocations[getLocationKey(c.petitioners[0])!]?.lon ?? '',
    month: c.receivedAt ? prepareDateFromString(c.receivedAt).monthLong : '',
    paper: c.isPaper ? 'Paper' : 'Electronic',
    represented:
      c.privatePractitioners && c.privatePractitioners?.length > 0
        ? 'Represented'
        : 'Not Represented',
    suffix: c.docketNumberSuffix ? c.docketNumberSuffix : 'None',
    year: `${c.sortableDocketNumber}`.slice(0, 5),
  }));
  generateCsv({ columns, filename: OUTPUT_FILENAME, rows });
  console.log(`Generated ${OUTPUT_FILENAME}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const cases = await getCasesInTimeframe({ applicationContext });
  await geocodeAllCases({ cases });
  outputCsv({ cases });
})();
