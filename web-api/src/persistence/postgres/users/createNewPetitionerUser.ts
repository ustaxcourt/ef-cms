import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '@web-api/applicationContext';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getUserGateway } from '@web-api/getUserGateway';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

// export const createUserRecords = async ({
//   applicationContext,
//   newUser,
//   userId,
// }: {
//   applicationContext: IApplicationContext;
//   newUser: RawUser;
//   userId: string;
// }) => {
//   await client.put({
//     Item: {
//       ...newUser,
//       pk: `user|${userId}`,
//       sk: `user|${userId}`,
//       userId,
//     },
//     applicationContext,
//   });

//   return {
//     ...newUser,
//     userId,
//   };
// };

export const createNewPetitionerUser = async ({
  user,
}: {
  user: RawUser;
}): Promise<void> => {
  const createUserPromise = getUserGateway().createUser(applicationContext, {
    email: user.pendingEmail!,
    name: user.name,
    role: ROLES.petitioner,
    sendWelcomeEmail: true,
    userId: user.userId,
  });

  const postgresCreatePromise = pgInsertInto({
    table: 'dwUser',
    values: [user],
  });

  // const createUserRecordsPromise = createUserRecords({
  //   applicationContext,
  //   newUser: user,
  //   userId: user.userId,
  // });

  await settlePromises([createUserPromise, postgresCreatePromise]);
};
