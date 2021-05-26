const AWS = require('aws-sdk');
const { chunk } = require('lodash');
const { getClient } = require('../elasticsearch/client');

const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} = require('../../shared/src/business/entities/EntityConstants');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const findDocketEntries = async () => {
  const esClient = await getClient({ environmentName, version });

  const allDocketEntries = [];
  const responseQueue = [];

  // start things off by searching, setting a scroll timeout, and pushing
  // our first response into the queue to be processed
  const response = await esClient.search({
    _source: [
      'pk.S',
      'eventCode.S',
      'servedAt.S',
      'docketEntryId.S',
      'documentId.S',
      'docketNumber.S',
    ],
    body: {
      query: {
        bool: {
          must: [
            { term: { 'entityName.S': 'DocketEntry' } },
            {
              exists: {
                field: 'servedAt',
              },
            },
            {
              bool: {
                must: [
                  {
                    terms: {
                      'eventCode.S': [
                        ...ORDER_EVENT_CODES,
                        ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    scroll: '30s',
    size: 5000,
  });

  responseQueue.push(response);

  while (responseQueue.length) {
    const body = responseQueue.shift();

    // collect the titles from this response
    body.hits.hits.forEach(function (hit) {
      allDocketEntries.push({
        docketEntryId: hit['_source'].docketEntryId.S,
        docketNumber: hit['_source'].pk.S.split('|')[1],
      });
    });

    // check to see if we have collected all of the quotes
    if (body.hits.total.value === allDocketEntries.length) {
      return allDocketEntries;
    }

    // get the next response if there are more quotes to fetch
    responseQueue.push(
      await esClient.scroll({
        scroll: '30s',
        scrollId: body['_scroll_id'],
      }),
    );
  }
};
let sent = 0;
(async () => {
  const docketEntries = await findDocketEntries();
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

  // output the case information
  const results = docketEntries.filter(Boolean);

  const chunks = chunk(results, 10);
  let done = 0;
  const promises = [];
  for (let chonk of chunks) {
    console.log('chonkin', chonk);
    promises.push(
      sqs
        .sendMessageBatch({
          Entries: chonk.map(segment => ({
            Id: `${sent++}`,
            MessageBody: JSON.stringify(segment),
          })),
          QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migrate_legacy_documents_queue_${process.env.ENV}`,
        })
        .promise()
        .then(() => {
          done += chunk.length;
          console.log(
            `${done} out of ${results.length} messages sent successfully.`,
          );
        })
        .catch(err => {
          console.log(err);
        }),
    );
  }
  await Promise.all(promises);
})();
