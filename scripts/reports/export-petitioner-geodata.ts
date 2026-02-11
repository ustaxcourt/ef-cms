#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { backfillUserGeocodes } from '../geocoding/backfill-user-geocodes';
import { getDbReader } from '@web-api/database';
import { generateCsv } from '../helpers/generate-csv';
import {
  calculateISODate,
  createISODateString,
  getJsDateFromIso,
} from '@shared/business/utilities/DateHandler';
import { sql } from 'kysely';

const todayDate = createISODateString().split('T')[0];
const defaultFromDate = calculateISODate({
  dateString: todayDate,
  howMuch: -1,
  units: 'years',
}).split('T')[0];

const scriptConfig: ScriptConfig = {
  description:
    'export-petitioner-geodata - Exports case petitioner geodata for QGIS',
  environment: {
    env: 'ENV',
  },
  parameters: {
    fromDate: {
      default: defaultFromDate,
      description: 'Range start date (YYYY-MM-DD, inclusive)',
      short: 'f',
      type: 'string',
    },
    toDate: {
      default: todayDate,
      description: 'Range end date (YYYY-MM-DD, exclusive)',
      short: 't',
      type: 'string',
    },
  },
  requireActiveAwsSession: false, // todo: put back
};

const { fromDate, toDate } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  fromDate: string;
  toDate: string;
};

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
      .execute(),
  )) as PetitionerGeoRow[];
};

const exportGeodata = async () => {
  const outputCsv = `${OUTPUT_DIR}/petitioner-geodata-${fromDate}-to-${toDate}.csv`;

  await backfillUserGeocodes({});

  const updatedRows = await getPetitionerGeodata({
    fromDateIso: fromDate,
    toDateIso: toDate,
  });

  const columns = [
    { header: 'docket_number', key: 'docket_number' },
    { header: 'docket_number_suffix', key: 'docket_number_suffix' },
    { header: 'received_year', key: 'received_year' },
    { header: 'procedure_type', key: 'procedure_type' },
    { header: 'case_type', key: 'case_type' },
    { header: 'party_type', key: 'party_type' },
    { header: 'status', key: 'status' },
    { header: 'is_paper', key: 'is_paper' },
    { header: 'preferred_trial_city', key: 'preferred_trial_city' },
    { header: 'remote_trial_granted', key: 'remote_trial_granted' },
    { header: 'address', key: 'address' },
    { header: 'city', key: 'city' },
    { header: 'state', key: 'state' },
    { header: 'postalCode', key: 'postalCode' },
    { header: 'lat', key: 'lat' },
    { header: 'lng', key: 'lng' },
    { header: 'is_represented', key: 'is_represented' },
  ];

  generateCsv({ columns, filename: outputCsv, rows: updatedRows });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
exportGeodata();
