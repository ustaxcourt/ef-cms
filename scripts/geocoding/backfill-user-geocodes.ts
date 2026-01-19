#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { geocodeAddress } from '@web-api/business/useCases/geocoding/getAddressGeocode';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { RawUser } from '@shared/business/entities/User';

const scriptConfig: ScriptConfig = {
  description:
    'backfill-user-geocodes - Geocode addresses for users missing lat/lng',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    batchSize: { default: 100, type: 'number' },
    delayMs: { default: 200, type: 'number' },
    dryRun: { default: false, type: 'boolean' },
  },
  requireActiveAwsSession: true,
};

const { batchSize, delayMs, dryRun } = parseArgsAndEnvVars(scriptConfig) as {
  batchSize: number;
  delayMs: number;
  dryRun: boolean;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getUsersMissingGeocode = async (limit: number) => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        .where(qb =>
          qb.or([qb('u.lat', 'is', null), qb('u.lng', 'is', null)]),
        )
        .where('u.contact', 'is not', null)
        .limit(limit)
        .execute(),
    )
  ).map(fromKyselyUser) as RawUser[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  let totalProcessed = 0;
  let totalGeocoded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  console.log(`Starting geocode backfill (dryRun=${dryRun}, batchSize=${batchSize}, delayMs=${delayMs})`);

  while (true) {
    const users = await getUsersMissingGeocode(batchSize);

    if (users.length === 0) {
      console.log('No more users to process');
      break;
    }

    console.log(`Processing batch of ${users.length} users...`);

    for (const user of users) {
      totalProcessed++;

      const contact = user.contact as any;

      if (!contact?.address1 || !contact?.city || !contact?.postalCode) {
        console.log(`Skipping user ${user.userId}: incomplete address`);
        totalSkipped++;
        continue;
      }

      if (dryRun) {
        console.log(`[DRY RUN] Would geocode user ${user.userId}: ${contact.address1}, ${contact.city}, ${contact.state} ${contact.postalCode}`);
        totalGeocoded++;
      } else {
        try {
          const result = await geocodeAddress(applicationContext, {
            address: {
              address1: contact.address1,
              city: contact.city,
              postalCode: contact.postalCode,
              state: contact.state,
            },
          });

          if (result) {
            await upsertUsers([{ ...user, lat: result.lat, lng: result.lng }]);
            console.log(`Geocoded user ${user.userId}: lat=${result.lat}, lng=${result.lng}`);
            totalGeocoded++;
          } else {
            console.log(`No geocode result for user ${user.userId}`);
            totalFailed++;
          }
        } catch (error: any) {
          console.error(`Error geocoding user ${user.userId}: ${error.message}`);
          totalFailed++;
        }

        await sleep(delayMs);
      }
    }
  }

  console.log(`\nBackfill complete:`);
  console.log(`  Total processed: ${totalProcessed}`);
  console.log(`  Total geocoded:  ${totalGeocoded}`);
  console.log(`  Total skipped:   ${totalSkipped}`);
  console.log(`  Total failed:    ${totalFailed}`);
})();
