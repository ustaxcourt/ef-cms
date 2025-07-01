import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { RawUser } from '@shared/business/entities/User';
import { upsertUserRecords } from '@web-api/persistence/postgres/users/upsertUserRecords';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { upsertPractitionerRecords } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecords';

export const processUserEntries = async ({
  userRecords,
}: {
  userRecords: any[];
}) => {
  if (!userRecords?.length) return;

  getDawsonLogger().debug(`going to index ${userRecords.length} user records`);

  try {
    const usersForPostgres = userRecords.map(userRecord => {
      const user = unmarshall(userRecord.dynamodb.NewImage) as RawUser;
      return user;
    });

    const practitioners = usersForPostgres.filter(
      user => user.entityName === Practitioner.ENTITY_NAME,
    );

    await upsertPractitionerRecords(
      practitioners.map(p => ({
        practitioner: p,
        userId: p.userId,
      })),
    );

    // this must come AFTER practitioners to prevent a ES index race condition
    await upsertUserRecords(usersForPostgres);
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process user record: `,
      e,
    );
  }
};
