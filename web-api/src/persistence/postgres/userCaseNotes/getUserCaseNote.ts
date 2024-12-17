import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getUserCaseNote = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}) => {
  const userCaseNote = await getDbReader(writer =>
    writer
      .selectFrom('dwUserCaseNote')
      .selectAll()
      .where('docketNumber', '=', docketNumber)
      .where('userId', '=', userId)
      .executeTakeFirst(),
  );

  return new UserCaseNote(transformNullToUndefined(userCaseNote));
};
