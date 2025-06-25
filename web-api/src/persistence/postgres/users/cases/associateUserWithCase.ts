import { pgInsertInto } from '../../utils/operation/pgInsertInto';
import { getDbReader } from '@web-api/database';
import { pgUpdateTable } from '../../utils/operation/pgUpdateTable';
import { UpdateUserOnCaseKysely } from '../schema';

export const associateUserWithCase = async ({
  docketNumber,
  userId,
  representing = undefined,
  entityName,
  serviceIndicatorOnCase,
}: {
  docketNumber: string;
  userId: string;
  representing?: string[];
  entityName?: string;
  serviceIndicatorOnCase?: string;
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

    values.entityName = entityName || userOnCaseRecord.entityName;
    values.representing = JSON.stringify(
      representing || userOnCaseRecord.representing || [],
    );
    values.serviceIndicatorOnCase =
      serviceIndicatorOnCase ||
      userOnCaseRecord.serviceIndicatorOnCase ||
      undefined;

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
        entityName,
        serviceIndicatorOnCase,
        representing: JSON.stringify(representing || []),
      },
      onConflictColumns: ['docketNumber', 'userId'],
    });
  }
};
