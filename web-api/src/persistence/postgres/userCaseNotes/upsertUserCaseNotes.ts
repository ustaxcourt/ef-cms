import { RawUserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { getDbWriter } from '@web-api/database';

export const upsertUserCaseNotes = async (userCaseNotes: RawUserCaseNote[]) => {
  if (userCaseNotes.length === 0) return;

  const userCaseNotesToUpsert = userCaseNotes.map(rawUserCaseNote => ({
    docketNumber: rawUserCaseNote.docketNumber,
    notes: rawUserCaseNote.notes,
    userId: rawUserCaseNote.userId,
  }));

  await getDbWriter(writer =>
    writer
      .insertInto('dwUserCaseNote')
      .values(userCaseNotesToUpsert)
      .onConflict(oc =>
        oc.columns(['docketNumber', 'userId']).doUpdateSet(c => {
          return {
            notes: c.ref('excluded.notes'),
          };
        }),
      )
      .execute(),
  );
};
