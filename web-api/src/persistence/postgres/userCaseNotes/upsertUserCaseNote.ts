import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { getDbWriter } from '@web-api/database';

export const upsertUserCaseNote = async ({
  caseNoteToUpsert,
}: {
  caseNoteToUpsert: UserCaseNote;
}) => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwUserCaseNote')
      .values({
        docketNumber: caseNoteToUpsert.docketNumber,
        notes: caseNoteToUpsert.notes,
        userId: caseNoteToUpsert.userId,
      })
      .onConflict(oc =>
        oc.columns(['docketNumber', 'userId']).doUpdateSet({
          notes: caseNoteToUpsert.notes,
        }),
      )
      .execute(),
  );
};
