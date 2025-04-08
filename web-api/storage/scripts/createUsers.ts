import { Practitioner } from '@shared/business/entities/Practitioner';
import {
  ROLES,
  Role,
} from '../../../shared/src/business/entities/EntityConstants';
import { createPetitionerUserRecord } from '@web-api/persistence/postgres/users/createPetitionerUserRecord';
import { createUserRecord } from '@web-api/persistence/postgres/users/createUserRecord';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { omit } from 'lodash';
import users from '../fixtures/seed/users.json';

export const createUsers = async () => {
  const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];
  const usersByEmail = {};

  getLogger().addUser({
    user: {
      email: 'system@ustc.gov',
      name: 'ustc automated system',
      role: ROLES.admin,
      userId: 'N/A',
    },
  });

  await Promise.all(
    users.map(async userRecord => {
      if (!userRecord.userId) {
        throw new Error('User has no uuid');
      }

      const { userId } = userRecord;

      const practitionerRoles: Role[] = [
        ROLES.irsPractitioner,
        ROLES.privatePractitioner,
        ROLES.inactivePractitioner,
      ];
      if (practitionerRoles.includes(userRecord.role as Role)) {
        const practitionerUser = new Practitioner(
          omit(userRecord, ['pk', 'sk']),
        )
          .validate()
          .toRawObject();

        const userCreated = await createUserRecord({
          user: practitionerUser,
          userId,
        });

        if (usersByEmail[userCreated.email]) {
          throw new Error('User already exists');
        }

        usersByEmail[userCreated.email] = userCreated;
        return;
      }

      if (userRecord.role === ROLES.petitioner) {
        const userCreated = await createPetitionerUserRecord({
          user: omit(userRecord, EXCLUDE_PROPS),
          userId,
        });

        if (usersByEmail[userCreated.email]) {
          throw new Error('User already exists');
        }
        usersByEmail[userCreated.email] = userCreated;
        return;
      }

      const userCreated = await createUserRecord({
        user: omit(userRecord, EXCLUDE_PROPS),
        userId,
      });

      if (usersByEmail[userCreated.email]) {
        throw new Error('User already exists');
      }

      usersByEmail[userCreated.email] = userCreated;
      return;
    }),
  );
};
