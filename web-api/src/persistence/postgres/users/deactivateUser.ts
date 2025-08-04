import { ACCOUNT_STATUS } from '@shared/business/entities/EntityConstants';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export async function deactivateUser({
  userId,
}: {
  userId: string;
}): Promise<void> {
  await pgUpdateTable({
    table: 'dwUser',
    where: db => db.where('userId', '=', userId),
    values: { accountStatus: ACCOUNT_STATUS.inactive },
  });
}
