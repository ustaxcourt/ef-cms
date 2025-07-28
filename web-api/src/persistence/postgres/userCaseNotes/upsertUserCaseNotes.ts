import { RawUserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { toKyselyNewUserCaseNote } from '@web-api/persistence/postgres/userCaseNotes/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertUserCaseNotes = async (userCaseNotes: RawUserCaseNote[]) => {
  if (userCaseNotes.length === 0) return;

  const userCaseNotesToUpsert = userCaseNotes.map(rawUserCaseNote =>
    toKyselyNewUserCaseNote({ userCaseNote: rawUserCaseNote }),
  );

  await pgInsertInto({
    table: 'dwUserCaseNote',
    values: userCaseNotesToUpsert,
    onConflictColumns: ['docketNumber', 'userId'],
  });
};
