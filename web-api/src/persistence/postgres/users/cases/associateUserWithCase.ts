import { pgInsertInto } from '../../utils/operation/pgInsertInto';
import { getDbReader } from '@web-api/database';
import { pgUpdateTable } from '../../utils/operation/pgUpdateTable';
import { UpdateUserOnCaseKysely } from '../schema';

export const associateUserWithCase = async ({
  docketNumber,
  userId,
  representing = undefined,
  serviceIndicator,
}: {
  docketNumber: string;
  userId: string;
  representing?: string[];
  serviceIndicator?: string;
}) => {
  const userOnCaseRecord = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as uoc')
      .where('uoc.userId', '=', userId)
      .where('uoc.docketNumber', '=', docketNumber)
      .selectAll('uoc')
      .executeTakeFirst(),
  );

  if (userOnCaseRecord) {
    const values: UpdateUserOnCaseKysely = {
      userId,
      docketNumber,
    };

    values.representing = JSON.stringify(
      representing || userOnCaseRecord.representing || [],
    );
    values.serviceIndicator =
      serviceIndicator || userOnCaseRecord.serviceIndicator || undefined;

    await pgUpdateTable({
      table: 'dwUserOnCase',
      values,
      where: cb =>
        cb
          .where('userId', '=', userOnCaseRecord.userId)
          .where('docketNumber', '=', userOnCaseRecord.docketNumber),
    });
  } else {
    await pgInsertInto({
      table: 'dwUserOnCase',
      values: {
        userId,
        docketNumber,
        serviceIndicator,
        representing: JSON.stringify(representing || []),
      },
      onConflictColumns: ['docketNumber', 'userId'],
    });
  }
};
