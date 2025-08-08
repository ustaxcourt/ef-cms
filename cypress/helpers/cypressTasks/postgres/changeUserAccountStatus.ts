import { AccountStatus } from '@shared/business/entities/EntityConstants';
import { getCypressPostgresDb } from './getCypressPostgresDb';

export const changeUserAccountStatus = async ({
  email,
  accountStatus,
}: {
  email: string;
  accountStatus: AccountStatus;
}): Promise<null> => {
  const dbConnection = await getCypressPostgresDb();

  await dbConnection
    .updateTable('dwUser')
    .set('accountStatus', accountStatus)
    .where('email', '=', email)
    .execute();

  return null;
};
