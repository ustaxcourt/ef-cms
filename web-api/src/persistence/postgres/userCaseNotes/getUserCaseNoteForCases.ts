import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getUserCaseNoteForCases = async ({
  docketNumbers,
  userId,
}: {
  docketNumbers: string[];
  userId: string;
}) => {
  const userCaseNotes = await getDbReader(reader =>
    reader
      .selectFrom('dwUserCaseNote')
      .selectAll()
      .where('userId', '=', userId)
      .where('docketNumber', 'in', docketNumbers)
      .execute(),
  );

  return userCaseNotes.map(
    userCaseNote => new UserCaseNote(transformNullToUndefined(userCaseNote)),
  );
};
