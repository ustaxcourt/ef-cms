#!/usr/bin/env -S npx ts-node --transpile-only

import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import PQueue from 'p-queue';
import fs from 'fs';
import path from 'path';
import { getDbReader } from '@web-api/database';

const scriptConfig: ScriptConfig = {
  description:
    'cleanup-corrupt-messages - Cleans up attachments on corrupt messages.',
  environment: {
    database: 'DB_NAME',
    host: 'DB_HOST',
    user: 'DB_USER',
  },
  parameters: {
    liveRun: {
      default: false,
      description:
        'If true, will proceed with removing the attachments from the impacted messages.',
      long: 'live-run',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: true,
};
const { liveRun } = parseArgsAndEnvVars(scriptConfig) as {
  liveRun: boolean;
};

type MessageFragment = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments: any[] | undefined;
  docketNumber: string;
  messageId: string;
};

const getDocketEntryIdsByDocketNumbers = async ({
  applicationContext,
  docketNumbers,
}: {
  applicationContext: ServerApplicationContext;
  docketNumbers: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> => {
  console.log('Fetching docket entries for each docket number...');

  const priorityQueue = new PQueue({ concurrency: 50 });

  const docketEntryIdsByDocketNumber: Record<string, string[]> = {};
  const correspondenceIdsByDocketNumber: Record<string, string[]> = {};

  const getDocketEntriesFunctions = docketNumbers.map(
    docketNumber => async () => {
      const docketEntries = (await queryFull({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${docketNumber}`,
          ':prefix': 'docket-entry|',
        },
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :prefix)',
        applicationContext,
      })) as RawDocketEntry[];

      const correspondence = (await queryFull({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${docketNumber}`,
          ':prefix': 'correspondence|',
        },
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :prefix)',
        applicationContext,
      })) as RawCorrespondence[];

      docketEntryIdsByDocketNumber[docketNumber] = docketEntries.map(
        docketEntry => docketEntry.docketEntryId,
      );

      correspondenceIdsByDocketNumber[docketNumber] = correspondence.map(
        c => c.correspondenceId,
      );
    },
  );

  await priorityQueue.addAll(getDocketEntriesFunctions);
  return { correspondenceIdsByDocketNumber, docketEntryIdsByDocketNumber };
};

const removePoisonAttachmentsFromMessages = ({
  correspondenceIdsByDocketNumber,
  docketEntryIdsByDocketNumber,
  messageFragments,
}: {
  messageFragments: MessageFragment[];
  docketEntryIdsByDocketNumber: Record<string, string[]>;
  correspondenceIdsByDocketNumber: Record<string, string[]>;
}): {
  deletedAttachmentAuditRecords: {
    messageId: string;
    docketEntryId: string;
  }[];
  updatedMessageFragments: MessageFragment[];
} => {
  const updatedMessageFragments: MessageFragment[] = [];
  const deletedAttachmentAuditRecords: {
    messageId: string;
    docketEntryId: string;
  }[] = [];
  for (const message of messageFragments) {
    if (message.attachments) {
      for (const attachment of message.attachments) {
        if (
          !docketEntryIdsByDocketNumber[message.docketNumber]?.includes(
            attachment.documentId,
          ) &&
          !correspondenceIdsByDocketNumber[message.docketNumber]?.includes(
            attachment.documentId,
          )
        ) {
          deletedAttachmentAuditRecords.push({
            docketEntryId: attachment.documentId,
            messageId: message.messageId,
          });
          console.log(
            `Removing attachment ${attachment.documentId} from message ${message.messageId}`,
          );
          message.attachments = message.attachments?.filter(
            att => att.documentId !== attachment.documentId,
          );
          updatedMessageFragments.push(message);
        }
      }
    }
  }

  return {
    deletedAttachmentAuditRecords,
    updatedMessageFragments,
  };
};

const udpateMessagesInDb = async (
  updatedMessageFragments: MessageFragment[],
) => {
  await getDbReader(db =>
    db.transaction().execute(async trx => {
      for (const message of updatedMessageFragments) {
        await trx
          .updateTable('dwMessage')
          .set({ attachments: JSON.stringify(message.attachments) })
          .where('messageId', '=', message.messageId)
          .execute();
      }
    }),
  );
};

(async () => {
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );

  console.log('Fetching messages that have not been replied to...');
  const messageFragments = await getDbReader(db =>
    db
      .selectFrom('dwMessage')
      .select(['attachments', 'messageId', 'docketNumber'])
      .execute(),
  );

  // collect all unique docket numbers from messages
  console.log('Collecting unique docket numbers from messages...');
  const docketNumbers = Array.from(
    new Set(messageFragments.map(message => message.docketNumber)),
  );

  const { correspondenceIdsByDocketNumber, docketEntryIdsByDocketNumber } =
    await getDocketEntryIdsByDocketNumbers({
      applicationContext,
      docketNumbers,
    });

  const { deletedAttachmentAuditRecords, updatedMessageFragments } =
    removePoisonAttachmentsFromMessages({
      correspondenceIdsByDocketNumber,
      docketEntryIdsByDocketNumber,
      messageFragments,
    });

  if (liveRun) {
    console.log(`Updating ${updatedMessageFragments.length} messages in DB...`);
    await udpateMessagesInDb(updatedMessageFragments);
  }

  const auditFilename = 'corruptMessageCleanupAudit.json';
  fs.writeFileSync(
    auditFilename,
    JSON.stringify(deletedAttachmentAuditRecords, null, 2),
  );

  console.log(
    '------------------------------------------------------------------',
  );
  console.log(
    `A log of attachments removed can be found here: ${path.resolve(__dirname, auditFilename)}`,
  );
  console.log(
    'Removed attachments count: ',
    deletedAttachmentAuditRecords.length,
  );
  console.log('Impacted messages count: ', updatedMessageFragments.length);
})();
