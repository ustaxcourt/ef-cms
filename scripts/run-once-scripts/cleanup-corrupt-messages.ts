#!/usr/bin/env npx ts-node --transpile-only

import { type ScriptConfig, parseArguments } from '../reports/reportUtils';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '../../web-api/src/applicationContext';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { connect } from '../../web-api/src/database';
import PQueue from 'p-queue';
import fs from 'fs';
import { queryFull } from '../../web-api/src/persistence/dynamodbClientService';
import { Signer } from '@aws-sdk/rds-signer';
import path from 'path';
import { Kysely } from 'kysely';
import { Database } from '../../web-api/src/database-types';

requireEnvVars(['REGION', 'DB_NAME', 'DB_HOST', 'DB_USER']);
const { DB_NAME, DB_HOST, DB_USER } = process.env;
const DB_PORT = 5432;

const scriptConfig: ScriptConfig = {
  parameters: {
    liveRun: {
      required: false,
      type: 'boolean',
      default: false,
      long: 'live-run',
      description:
        'If true, will proceed with removing the attachments from the impacted messages.',
    },
  },
};

type MessageFragment = {
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
}): Promise<Record<string, string[]>> => {
  console.log(`Fetching docket entries for each docket number...`);

  const priorityQueue = new PQueue({ concurrency: 50 });

  const docketEntryIdsByDocketNumber: Record<string, string[]> = {};

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

      docketEntryIdsByDocketNumber[docketNumber] = docketEntries.map(
        docketEntry => docketEntry.docketEntryId,
      );
    },
  );

  await priorityQueue.addAll(getDocketEntriesFunctions);
  return docketEntryIdsByDocketNumber;
};

const removePoisonAttachmentsFromMessages = async ({
  messageFragments,
  docketEntryIdsByDocketNumber,
}: {
  messageFragments: MessageFragment[];
  docketEntryIdsByDocketNumber: Record<string, string[]>;
}): Promise<{
  deletedAttachmentAuditRecords: {
    messageId: string;
    docketEntryId: string;
  }[];
  updatedMessageFragments: MessageFragment[];
}> => {
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
          )
        ) {
          deletedAttachmentAuditRecords.push({
            messageId: message.messageId,
            docketEntryId: attachment.documentId,
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
  db: Kysely<Database>,
  updatedMessageFragments: MessageFragment[],
) => {
  await db.transaction().execute(async trx => {
    for (const message of updatedMessageFragments) {
      await trx
        .updateTable('dwMessage')
        .set({ attachments: JSON.stringify(message.attachments) })
        .where('messageId', '=', message.messageId)
        .execute();
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );

  const { liveRun } = parseArguments(scriptConfig);

  const sourceSigner = new Signer({
    hostname: DB_HOST!,
    port: DB_PORT,
    region: 'us-east-1',
    username: DB_USER!,
  });
  const sourcePassword = await sourceSigner.getAuthToken();

  const config = {
    database: DB_NAME,
    host: DB_HOST,
    idleTimeoutMillis: 1000,
    max: 1,
    password: sourcePassword,
    port: DB_PORT,
    user: DB_USER,
    ssl: {
      ca: fs.readFileSync('global-bundle.pem').toString(),
    },
  };

  const db = await connect(config);

  console.log('Fetching messages that have not been replied to...');
  const messageFragments = await db
    .selectFrom('dwMessage')
    .select(['attachments', 'messageId', 'docketNumber'])
    .where('isRepliedTo', '=', false)
    .execute();

  // collect all unique docket numbers from messages
  console.log('Collecting unique docket numbers from messages...');
  const docketNumbers = Array.from(
    new Set(messageFragments.map(message => message.docketNumber)),
  );

  const docketEntryIdsByDocketNumber = await getDocketEntryIdsByDocketNumbers({
    applicationContext,
    docketNumbers,
  });

  const { deletedAttachmentAuditRecords, updatedMessageFragments } =
    await removePoisonAttachmentsFromMessages({
      docketEntryIdsByDocketNumber,
      messageFragments,
    });

  if (liveRun) {
    console.log(`Updating ${updatedMessageFragments.length} messages in DB...`);
    await udpateMessagesInDb(db, updatedMessageFragments);
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
