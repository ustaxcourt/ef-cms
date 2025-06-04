import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { RawUser } from '@shared/business/entities/User';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { upsertPractitionerRecord } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecord';
import { merge } from 'lodash';

export const processUserEntries = async ({
  userRecords,
}: {
  userRecords: any[];
}) => {
  if (!userRecords?.length) return;

  getDawsonLogger().debug(`going to index ${userRecords.length} user records`);

  try {
    await upsertUsers(
      userRecords.map(userRecord => {
        const user = unmarshall(userRecord.dynamodb.NewImage) as RawUser;

        const { contact, ...rest } = user;
        const flatUser = merge({}, rest, contact || {});

        return flatUser;
      }),
    );

    userRecords.forEach(async userRecord => {
      const user = unmarshall(userRecord.dynamodb.NewImage) as RawUser;

      const { contact, ...rest } = user;
      const flatUser = merge({}, rest, contact || {});

      if (flatUser.entityName?.includes(Practitioner.ENTITY_NAME)) {
        await upsertPractitionerRecord({
          practitioner: flatUser,
          userId: flatUser.userId,
        });
      }
    });
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process user record: ${e}`,
    );
  }
};
