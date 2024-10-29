import { getDbWriter } from '@web-api/database';

export const updateUserCaseNote = async ({
  caseNoteToUpdate,
}: {
  caseNoteToUpdate: TCaseNote;
}) => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwUserCaseNote')
      .values({
        docketNumber: caseNoteToUpdate.docketNumber,
        notes: caseNoteToUpdate.notes,
        userId: caseNoteToUpdate.userId,
      })
      .onConflict(oc =>
        oc.columns(['docketNumber', 'userId']).doUpdateSet({
          notes: caseNoteToUpdate.notes,
        }),
      )
      .execute(),
  );
};
