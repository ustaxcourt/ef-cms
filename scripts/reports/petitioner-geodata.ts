#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  getTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { generateCsv } from '../helpers/generate-csv';
import {
  getJsDateFromIso,
  getNowObject,
} from '@shared/business/utilities/DateHandler';
import { sql } from 'kysely';
import { backfillUserGeocodes } from '../geocoding/backfillUserGeocodes';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'export-petitioner-geodata - Exports case petitioner geodata for QGIS',
  environment: {
    env: 'ENV',
  },
  parameters: {
    years: {
      default: `${thisYear}`,
      description:
        'Year(s): single year, comma-separated list, range, or mix (e.g. 2019,2021,2023-2025)',
      short: 'y',
      type: 'string',
      transform: 'number',
      commaDelimited: true,
    },
    fiscal: {
      default: false,
      description: 'Use fiscal year (starts 10/1) instead of calendar year',
      short: 'f',
      type: 'boolean',
    },
    backfillData: {
      default: true,
      description:
        'Whether or not we should try to populate any missing data for this date range',
      short: 'b',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: true,
};

const { years, fiscal, backfillData } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  years: number[];
  fiscal: boolean;
  backfillData: boolean;
};

const yearsToUse = years?.length ? years : [thisYear!];
const timeframes = yearsToUse.map(y =>
  getTimeframeForYear({ fiscal, year: `${y}` }),
);
const fromDateIso = timeframes.map(t => t.begin).sort()[0];
const toDateIso = timeframes
  .map(t => t.end)
  .sort()
  .reverse()[0];

type PetitionerGeoRow = {
  docket_number: string;
  docket_number_suffix: string | null;
  received_year: number;
  procedure_type: string;
  case_type: string;
  party_type: string;
  status: string;
  is_paper: boolean | null;
  preferred_trial_city: string | null;
  remote_trial_granted: boolean | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  lat: number | null;
  lng: number | null;
  geodataMatch: boolean | null;
  userId: string;
  is_represented: string;
};

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getPetitionerGeodata = async ({
  fromDateIso,
  toDateIso,
}: {
  fromDateIso: string;
  toDateIso: string;
}): Promise<PetitionerGeoRow[]> => {
  return (await getDbReader(db =>
    db
      .with('represented_users', db =>
        db
          .selectFrom('dwUserOnCase as uoc')
          .crossJoin(
            sql`LATERAL jsonb_array_elements_text(uoc.representing)`.as(
              'represented_user_id',
            ),
          )
          .select([
            sql<string>`uoc.docket_number`.as('docket_number'),
            sql<string>`represented_user_id`.as('represented_user_id'),
            sql<string>`uoc.user_id`.as('user_id'),
          ]),
      )
      .selectFrom('dwCase as c')
      .crossJoin(
        sql`LATERAL jsonb_array_elements(c.petitioners)`.as('petitioner'),
      )
      .innerJoin('dwUserContact as uc', join =>
        join
          .onRef('uc.docketNumber', '=', 'c.docketNumber')
          .on(sql`petitioner->>'contactId'`, '=', sql`uc.user_id`),
      )
      .select([
        sql<string>`c.docket_number`.as('docket_number'),
        sql<string>`c.docket_number_suffix`.as('docket_number_suffix'),
        sql<number>`date_part('year', c.received_at)`.as('received_year'),
        sql<string>`c.procedure_type`.as('procedure_type'),
        sql<string>`c.case_type`.as('case_type'),
        sql<string>`c.party_type`.as('party_type'),
        sql<string>`c.status`.as('status'),
        sql<boolean>`c.is_paper`.as('is_paper'),
        sql<string>`c.preferred_trial_city`.as('preferred_trial_city'),
        sql<boolean>`c.remote_trial_granted`.as('remote_trial_granted'),
        sql<string>`petitioner->>'address1'`.as('address'),
        sql<string>`petitioner->>'city'`.as('city'),
        sql<string>`petitioner->>'state'`.as('state'),
        sql<string>`petitioner->>'postalCode'`.as('postalCode'),
        sql<number>`uc.lat`.as('lat'),
        sql<number>`uc.lng`.as('lng'),
        sql<boolean>`uc.geodata_match`.as('geodataMatch'),
        sql<string>`
          CASE
            WHEN EXISTS (
              SELECT 1
              FROM represented_users ru
              WHERE ru.docket_number = c.docket_number
                AND petitioner->>'contactId' = ru.represented_user_id
            ) THEN 'Represented'
            ELSE ''
          END
        `.as('is_represented'),
      ])
      .where('c.receivedAt', '>=', getJsDateFromIso(fromDateIso))
      .where('c.receivedAt', '<', getJsDateFromIso(toDateIso))
      .where('uc.geodataMatch', 'is', true)
      .execute(),
  )) as PetitionerGeoRow[];
};

const exportGeodata = async () => {
  const outputCsv = `${OUTPUT_DIR}/petitioner-geodata-${fiscal ? 'fy-' : ''}${yearsToUse.join('-')}.csv`;

  if (backfillData) await backfillUserGeocodes({ fromDateIso, toDateIso });

  const userGeodata = (
    await getPetitionerGeodata({
      fromDateIso,
      toDateIso,
    })
  ).map(row => ({
    ...row,
    address: row.address?.replace(/\r\n|\r|\n/g, ' ').trim() ?? null,
  }));

  const columns = [
    { header: 'docket_number', key: 'docketNumber' },
    { header: 'docket_number_suffix', key: 'docketNumberSuffix' },
    { header: 'received_year', key: 'receivedYear' },
    { header: 'procedure_type', key: 'procedureType' },
    { header: 'case_type', key: 'caseType' },
    { header: 'party_type', key: 'partyType' },
    { header: 'status', key: 'status' },
    { header: 'is_paper', key: 'isPaper' },
    { header: 'preferred_trial_city', key: 'preferredTrialCity' },
    { header: 'remote_trial_granted', key: 'remoteTrialGranted' },
    { header: 'address', key: 'address' },
    { header: 'city', key: 'city' },
    { header: 'state', key: 'state' },
    { header: 'postalCode', key: 'postalCode' },
    { header: 'lat', key: 'lat' },
    { header: 'lng', key: 'lng' },
    { header: 'is_represented', key: 'isRepresented' },
  ];

  generateCsv({ columns, filename: outputCsv, rows: userGeodata });
  console.log('Petitioner geocode report complete.');
  console.log(`Report can be found at: ${outputCsv}`);
};

exportGeodata().catch(e => {
  throw e;
});
