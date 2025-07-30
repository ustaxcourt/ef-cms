import { fromKyselyUserCaseNote } from '@web-api/persistence/postgres/userCaseNotes/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';

export const getUserCaseNotes = async ({
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

  return userCaseNotes.map(userCaseNote =>
    fromKyselyUserCaseNote(userCaseNote),
  );
};
