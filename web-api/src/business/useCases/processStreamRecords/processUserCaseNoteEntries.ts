import { RawUserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertUserCaseNotes } from '@web-api/persistence/postgres/userCaseNotes/upsertUserCaseNotes';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processUserCaseNoteEntries = async ({
  applicationContext,
  userCaseNoteRecords,
}: {
  applicationContext: ServerApplicationContext;
  userCaseNoteRecords: any[];
}) => {
  if (!userCaseNoteRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${userCaseNoteRecords.length} userCaseNote records`,
  );

  await upsertUserCaseNotes(
    userCaseNoteRecords.map(userCaseNoteRecord => {
      return unmarshall(
        userCaseNoteRecord.dynamodb.NewImage,
      ) as RawUserCaseNote;
    }),
  );
};
