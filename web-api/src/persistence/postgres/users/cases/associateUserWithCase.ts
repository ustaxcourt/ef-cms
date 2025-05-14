import { pgInsertInto } from '../../utils/operation/pgInsertInto';
import { getDbReader } from '@web-api/database';
import { pgUpdateTable } from '../../utils/operation/pgUpdateTable';
import { UpdateUserOnCaseKysely } from '../schema';

export const associateUserWithCase = async ({
  docketNumber,
  userId,
  representing = undefined,
  entityName,
}: {
  docketNumber: string;
  userId: string;
  representing?;
  entityName?;
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

    if (entityName) {
      values.entityName = entityName;
    }

    if (representing) {
      values.representing = JSON.stringify(representing);
    }

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
        representing: representing ? JSON.stringify(representing) : undefined,
      },
      onConflictColumns: ['docketNumber', 'userId'],
    });
  }
};
