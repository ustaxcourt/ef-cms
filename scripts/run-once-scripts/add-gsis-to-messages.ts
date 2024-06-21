/* eslint-disable */
import { calculateTimeToLive } from '../../web-api/src/persistence/dynamo/calculateTimeToLive';
import { TDynamoRecord } from '../../web-api/src/persistence/dynamo/dynamoTypes';
import { createApplicationContext } from '../../web-api/src/applicationContext';

const args = process.argv.slice(2);
const CHUNK_SIZE = 200;

const getMessages = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<RawCase[]> => {
  const searchOutput = await applicationContext.getSearchClient().search({
    body: {
      query: {
        match_all: {},
      },
    },
    index: 'efcms-message',
  });

  const results = searchOutput.body.hits.hits;
  return results as unknown as RawCase[];
};

const applyMessageChanges = ({ messages }) => {
  const messagesAfter: TDynamoRecord[] = [];
  for (const message of messages) {
    if (!message.completedAt) {
      const ttl = calculateTimeToLive({
        numDays: 8,
        timestamp: message.createdAt!,
      });

      // add outbox records
      messagesAfter.push({
        ...message,
        gsi1pk: undefined,
        pk: `message|outbox|user|${message.fromUserId}`,
        sk: message.createdAt,
        ttl: ttl.expirationTimestamp,
      });
      messagesAfter.push({
        ...message,
        gsi1pk: undefined,
        pk: `message|outbox|section|${message.fromSection}`,
        sk: message.createdAt,
        ttl: ttl.expirationTimestamp,
      });

      // add global secondary indexes
      message.gsiUserBox = message.toUserId
        ? `assigneeId|${message.toUserId}`
        : undefined;
      message.gsiSectionBox = message.toSection
        ? `section|${message.toSection}`
        : undefined;
      messagesAfter.push(message);
    } else {
      const ttl = calculateTimeToLive({
        numDays: 8,
        timestamp: message.completedAt!,
      });

      // add completed box records
      messagesAfter.push({
        ...message,
        gsi1pk: undefined,
        pk: `message|completed|user|${message.completedByUserId}`,
        sk: message.completedAt!,
        ttl: ttl.expirationTimestamp,
      });
      messagesAfter.push({
        ...message,
        gsi1pk: undefined,
        pk: `message|completed|section|${message.completedBySection}`,
        sk: message.completedAt!,
        ttl: ttl.expirationTimestamp,
      });

      // completed message does not get global secondary indexes
      messagesAfter.push({
        ...message,
        gsiSectionBox: undefined,
        gsiUserBox: undefined,
      });
    }
  }
  return messagesAfter;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  const applicationContext = createApplicationContext({});
  const messages = await getMessages({ applicationContext });
  // console.log('messages', messages);

  // const updatedMessages = applyMessageChanges({messages});
  // write to Dynamo
})();
