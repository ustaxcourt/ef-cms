import { Practitioner } from '@shared/business/entities/Practitioner';
import {
  PRACTITIONER_ROLES,
  ROLES,
} from '../../../shared/src/business/entities/EntityConstants';
import { createUserRecord } from '@web-api/persistence/postgres/users/createUserRecord';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { omit } from 'lodash';
import users from '../fixtures/seed/users.json';
import { upsertPractitionerRecord } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecord';

export const createUsersAndPractitioners = async () => {
  const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];

  getDawsonLogger().addUser({
    user: {
      email: 'system@ustc.gov',
      name: 'ustc automated system',
      role: ROLES.admin,
      userId: 'N/A',
    },
  });

  await Promise.all(
    users.map(async (userRecord: any) => {
      if (!userRecord.userId) {
        throw new Error('User has no uuid');
      }

      const { userId } = userRecord;

      if (PRACTITIONER_ROLES.includes(userRecord.role)) {
        const practitioner = new Practitioner(omit(userRecord, ['pk', 'sk']))
          .validate()
          .toRawObject();

        await upsertPractitionerRecord({
          practitioner,
          userId,
        });
      }

      await createUserRecord({
        user: omit(userRecord, EXCLUDE_PROPS),
        userId,
      });

      return;
    }),
  );
};
