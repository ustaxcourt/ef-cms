import { ACCOUNT_STATUS } from '@shared/business/entities/EntityConstants';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export async function deactivateUser({
  userId,
}: {
  userId: string;
}): Promise<string | undefined> {
  const updated = await pgUpdateTable({
    table: 'dwUser',
    where: db => db.where('userId', '=', userId),
    values: { accountStatus: ACCOUNT_STATUS.inactive },
  });

  return transformNullToUndefined(updated[0].section) || undefined;
}
