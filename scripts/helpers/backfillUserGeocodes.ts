import { getJsDateFromIso } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { upsertUserContacts } from '@web-api/persistence/postgres/userContacts/upsertUserContacts';
import { sql } from 'kysely';
import { ask } from 'scripts/helpers/prompts';
import { Geocoder } from 'us-census-geocoder';

type geoResults = {
  docketNumber: string;
  userId: string;
  address1: string;
  state?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  match?: boolean;
};

const getUsersMissingGeocode = async (
  limit: number,
  fromDateIso?: string,
  toDateIso?: string,
): Promise<geoResults[]> => {
  let query = await getDbReader(db =>
    db
      .selectFrom('dwCase as c')
      .crossJoin(
        sql`LATERAL jsonb_array_elements(c.petitioners)`.as('petitioner'),
      )
      .leftJoin('dwUserContact as uc', join =>
        join
          .onRef(sql`petitioner->>'contactId'`, '=', 'uc.userId')
          .onRef('c.docketNumber', '=', 'uc.docketNumber'),
      )
      .select([
        'c.docketNumber',
        sql<string>`petitioner ->> 'contactId'`.as('userId'),
        sql<string>`petitioner ->> 'address1'`.as('address1'),
        sql<string>`petitioner ->> 'state'`.as('state'),
        sql<string>`petitioner ->> 'city'`.as('city'),
        sql<string>`petitioner ->> 'postalCode'`.as('zip'),
      ])
      .where('c.status', 'not in', ['Closed', 'Dismissed'])
      .where(qb => qb.or([qb('uc.lat', 'is', null), qb('uc.lng', 'is', null)]))
      .where('uc.geodataMatch', 'is', null)
      .where(sql`petitioner ->> 'address1'`, 'is not', null)
      .limit(limit),
  );
  if (fromDateIso)
    query = query.where('c.receivedAt', '>=', getJsDateFromIso(fromDateIso));

  if (toDateIso)
    query = query.where('c.receivedAt', '<', getJsDateFromIso(toDateIso));

  return (await query.execute()) as geoResults[];
};

const getUserMissingGeocodeCount = async (
  fromDateIso?: string,
  toDateIso?: string,
) => {
  let query = await getDbReader(db =>
    db
      .selectFrom('dwCase as c')
      .crossJoin(
        sql`LATERAL jsonb_array_elements(c.petitioners)`.as('petitioner'),
      )
      .leftJoin('dwUserContact as uc', join =>
        join
          .onRef(sql`petitioner->>'contactId'`, '=', 'uc.userId')
          .onRef('c.docketNumber', '=', 'uc.docketNumber'),
      )
      .select([sql<number>`count(1)`.as('count')])
      .where('c.status', 'not in', ['Closed', 'Dismissed'])
      .where(qb => qb.or([qb('uc.lat', 'is', null), qb('uc.lng', 'is', null)]))
      .where('uc.geodataMatch', 'is', null)
      .where(sql`petitioner ->> 'address1'`, 'is not', null),
  );
  if (fromDateIso)
    query = query.where('c.receivedAt', '>=', getJsDateFromIso(fromDateIso));

  if (toDateIso)
    query = query.where('c.receivedAt', '<', getJsDateFromIso(toDateIso));

  return await query.executeTakeFirst();
};

export const backfillUserGeocodes = async ({
  batchSize = 10000,
  delayMs = 6000,
  dryRun = false,
  fromDateIso,
  toDateIso,
}: {
  batchSize?: number;
  delayMs?: number;
  dryRun?: boolean;
  fromDateIso?: string;
  toDateIso?: string;
}) => {
  let totalProcessed = 0;

  const count = (await getUserMissingGeocodeCount(fromDateIso, toDateIso))
    ?.count;

  if (count == 0) {
    console.log('There are no addresses to geocode in this range');
    return;
  }

  const userInput = await ask(
    `You are about to geocode ${count} addresses. Proceed? y/n `,
  );
  if (userInput.toLowerCase() !== 'y') {
    return;
  }

  console.log(
    `Starting geocode backfill (dryRun=${dryRun}, batchSize=${batchSize}, delayMs=${delayMs})`,
  );

  while (true) {
    const users = await getUsersMissingGeocode(
      batchSize,
      fromDateIso,
      toDateIso,
    );

    if (users.length === 0) {
      console.log('No more users to process');
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

    // Should dry run stop us from calling the API or just stop us from updating contacts?
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

    console.log(`Completed ${totalProcessed} / ${count}`);
  }

  console.log(`\nBackfill complete:`);
  console.log(`  Total processed: ${totalProcessed}`);
};
