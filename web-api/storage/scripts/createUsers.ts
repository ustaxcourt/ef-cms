import {
  ROLES,
  Role,
} from '../../../shared/src/business/entities/EntityConstants';
import { createApplicationContext } from '../../src/applicationContext';
import { createPetitionerUserRecords } from '../../../web-api/src/persistence/dynamo/users/createPetitionerUserRecords';
import { createUserRecords as createPractitionerUserRecords } from '../../../web-api/src/persistence/dynamo/users/createOrUpdatePractitionerUser';
import { createUserRecords } from '../../../web-api/src/persistence/dynamo/users/createOrUpdateUser';
import { omit } from 'lodash';
import users from '../fixtures/seed/users.json';

let usersByEmail = {};

const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];

export const createUsers = async () => {
  usersByEmail = {};

  const user = {
    role: ROLES.admin,
  };

  const applicationContext = createApplicationContext(user);

  await Promise.all(
    users.map(userRecord => {
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
        return createPractitionerUserRecords({
          applicationContext,
          user: omit(userRecord, EXCLUDE_PROPS),
          userId,
        }).then(userCreated => {
          if (usersByEmail[userCreated.email]) {
            throw new Error('User already exists');
          }
          usersByEmail[userCreated.email] = userCreated;
        });
      }

      if (userRecord.role === ROLES.petitioner) {
        return createPetitionerUserRecords({
          applicationContext,
          user: omit(userRecord, EXCLUDE_PROPS),
          userId,
        }).then(userCreated => {
          if (usersByEmail[userCreated.email]) {
            throw new Error('User already exists');
          }
          usersByEmail[userCreated.email] = userCreated;
        });
      }

      return createUserRecords({
        applicationContext,
        user: omit(userRecord, EXCLUDE_PROPS),
        userId,
      }).then(userCreated => {
        if (usersByEmail[userCreated.email]) {
          throw new Error('User already exists');
        }
        usersByEmail[userCreated.email] = userCreated;
      });
    }),
  );
};

export const asUserFromEmail = async (email, callback) => {
  const asUser = usersByEmail[email];
  if (!asUser) {
    throw new Error('User not found');
  }
  const applicationContext = createApplicationContext(asUser);
  return await callback(applicationContext);
};
