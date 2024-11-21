// this script parses the "Populated Places" Topical Gazetteer published by the USGS and generates a static json file
// https://www.usgs.gov/us-board-on-geographic-names/download-gnis-data

import { abbr } from 'us-state-converter';
import { appendFileSync, createReadStream, existsSync, unlinkSync } from 'fs';
import { once } from 'events';
import readline from 'readline';

const INPUT_FILE_PATH = `${process.env.HOME}/Downloads/PopulatedPlaces_National.txt`;
const OUTPUT_FILE_PATH = './scripts/helpers/geocoded-locations.json';

const geocodedLocations: { [K: string]: { lat: number; lon: number } } = {};

const parsePopulatedPlaces = async () => {
  const rl = readline.createInterface({
    crlfDelay: Infinity,
    input: createReadStream(INPUT_FILE_PATH),
  });

  rl.on('line', line => {
    const fields = line.split('|');
    if (fields[1] !== 'feature_name') {
      const city = fields[1].replace(/\(historical\)|[^A-Za-z]/g, '').toLowerCase();
      const state =
        abbr(fields[3]) === 'No abbreviation found with that state name'
          ? fields[3].replace(/[^A-Za-z]/g, '').toLowerCase()
          : abbr(fields[3]).toLowerCase();
      const key = `${state}_${city}`;
      const lat = Number(fields[15]);
      const lon = Number(fields[16]);
      geocodedLocations[key] = { lat, lon };
    }
  });

  await once(rl, 'close');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  if (!existsSync(INPUT_FILE_PATH)) {
    console.log('Error: expected input file not found!');
    process.exit(1);
  }
  await parsePopulatedPlaces();

  if (existsSync(OUTPUT_FILE_PATH)) {
    unlinkSync(OUTPUT_FILE_PATH);
  }
  appendFileSync(OUTPUT_FILE_PATH, JSON.stringify(geocodedLocations));
})();
