import { RawUserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertUserCaseNotes = async (userCaseNotes: RawUserCaseNote[]) => {
  if (userCaseNotes.length === 0) return;

  const userCaseNotesToUpsert = userCaseNotes.map(rawUserCaseNote => ({
    docketNumber: rawUserCaseNote.docketNumber,
    notes: rawUserCaseNote.notes,
    userId: rawUserCaseNote.userId,
  }));

  await pgInsertInto({
    table: 'dwUserCaseNote',
    values: userCaseNotesToUpsert,
    onConflictColumns: ['docketNumber', 'userId'],
  });
};
