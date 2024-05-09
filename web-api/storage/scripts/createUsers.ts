import { Practitioner } from '@shared/business/entities/Practitioner';
import {
  ROLES,
  Role,
} from '../../../shared/src/business/entities/EntityConstants';
import { createApplicationContext } from '../../src/applicationContext';
import { createPetitionerUserRecords } from '../../../web-api/src/persistence/dynamo/users/createPetitionerUserRecords';
import { createUserRecords } from '../../src/persistence/dynamo/users/createUserRecords';
import { omit } from 'lodash';
import users from '../fixtures/seed/users.json';

export const createUsers = async () => {
  const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];
  const usersByEmail = {};

  const applicationContext = createApplicationContext({
    role: ROLES.admin,
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

        const userCreated = await applicationContext
          .getPersistenceGateway()
          .createUserRecords({
            applicationContext,
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
        const userCreated = await createPetitionerUserRecords({
          applicationContext,
          user: omit(userRecord, EXCLUDE_PROPS),
          userId,
        });

        if (usersByEmail[userCreated.email]) {
          throw new Error('User already exists');
        }
        usersByEmail[userCreated.email] = userCreated;
        return;
      }

      const userCreated = await createUserRecords({
        applicationContext,
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
