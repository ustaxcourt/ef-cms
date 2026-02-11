import { getDbReader } from '@web-api/database';
import { upsertUserContacts } from '@web-api/persistence/postgres/userContact/upsertUserContact';
import { sql } from 'kysely';
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
  return (await query.execute()) as geoResults[];
};

export const backfillUserGeocodes = async ({
  batchSize = 10000,
  delayMs = 6000,
  dryRun = false,
}: {
  batchSize?: number;
  delayMs?: number;
  dryRun?: boolean;
}) => {
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
  }

  console.log(`\nBackfill complete:`);
  console.log(`  Total processed: ${totalProcessed}`);
  console.log(`  Total geocoded:  ${totalGeocoded}`);
};
