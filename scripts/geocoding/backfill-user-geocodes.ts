#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';
import { Uuid } from '@opensearch-project/opensearch/api/_types/_common';
import { Geocoder } from 'us-census-geocoder';
import { upsertUserContacts } from '@web-api/persistence/postgres/userContact/upsertUserContact';

const scriptConfig: ScriptConfig = {
  description:
    'backfill-user-geocodes - Geocode addresses for users missing lat/lng',
  // environment: {
  //   env: 'ENV',
  //   region: 'REGION',
  // },
  parameters: {
    batchSize: { default: '10000', type: 'string' },
    delayMs: { default: '60000', type: 'string' },
    dryRun: { default: false, type: 'boolean' },
  },
  // requireActiveAwsSession: true,
};

const { batchSize, delayMs, dryRun } = parseArgsAndEnvVars(scriptConfig) as {
  batchSize: number;
  delayMs: number;
  dryRun: boolean;
};

type geoResults = {
  docketNumber: string;
  userId: Uuid;
  address1: string;
  state?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  match?: boolean;
};

const getUsersMissingGeocode = async (limit: number): Promise<geoResults[]> => {
  const query = await getDbReader(db =>
    db
      .selectFrom('dwCase as c')
      .crossJoin(
        sql`LATERAL jsonb_array_elements(c.petitioners)`.as('petitioner'),
      )
      .leftJoin('dwUserContact as uc', join =>
        join.on(sql`petitioner->>'contactId'`, '=', sql`uc.user_id`),
      )
      .select([
        'c.docketNumber',
        sql`petitioner ->> 'contactId'`.as('userId'),
        sql`petitioner ->> 'address1'`.as('address1'),
        sql`petitioner ->> 'state'`.as('state'),
        sql`petitioner ->> 'city'`.as('city'),
        sql`petitioner ->> 'postalCode'`.as('zip'),
      ])
      .where('c.status', 'not in', ['Closed', 'Dismissed'])
      .where(qb => qb.or([qb('uc.lat', 'is', null), qb('uc.lng', 'is', null)]))
      .where('uc.geodataMatch', 'is', null)
      .where(sql`petitioner ->> 'address1'`, 'is not', null)
      .limit(limit),
  );
  const querySQL = query.compile();
  console.log(querySQL);
  return (await query.execute()) as unknown as geoResults[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  let totalProcessed = 0;
  let totalGeocoded = 0;

  console.log(
    `Starting geocode backfill (dryRun=${dryRun}, batchSize=${batchSize}, delayMs=${delayMs})`,
  );

  while (true) {
    const users = await getUsersMissingGeocode(batchSize);

    if (users.length === 0) {
      console.log('No more users to process');
      break;
    }
    if (totalProcessed >= users.length) {
      console.log('Weve been here too long');
      break;
    }

    console.log(`Processing batch of ${users.length} users...`);
    const geocoder = new Geocoder();

    for (const user of users) {
      totalProcessed++;

      if (dryRun) {
        console.log(
          `[DRY RUN] Would geocode user ${user.userId}: ${user.address1}, ${user.city}, ${user.state} ${user.zip}`,
        );
        totalGeocoded++;
      } else {
        geocoder.add(
          `${user.userId}-${user.docketNumber}`,
          {
            address: user.address1,
            city: user.city,
            state: user.state,
            zip: user.zip,
          },
          response => {
            user.lat = response.lat;
            user.lng = response.lon;
            user.match = true;
          },
        );
      }
    }

    await geocoder.geocode();

    await upsertUserContacts(
      users.map(contact => ({
        userId: contact.userId,
        docketNumber: contact.docketNumber,
        lat: contact.lat || null,
        lng: contact.lng || null,
        geodataMatch: contact.match || false,
      })),
    );
  }

  console.log(`\nBackfill complete:`);
  console.log(`  Total processed: ${totalProcessed}`);
  console.log(`  Total geocoded:  ${totalGeocoded}`);
})();
