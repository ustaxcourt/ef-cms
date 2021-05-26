const { DynamoDB } = require('aws-sdk');
const { getClient } = require('../elasticsearch/client');

const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} = require('../../shared/src/business/entities/EntityConstants');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const dynamodb = new DynamoDB({ region: 'us-east-1' });
const TableName = `efcms-${environmentName}-${version}`;

const findDocketEntries = async startDate => {
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
      'isStricken.BOOL',
      'signedJudgeName.S',
      'advancedocket.S',
    ],
    body: {
      query: {
        range: {
          'servedAt.S': {
            gte: startDate,
          },
        },
        terms: {
          'eventCode.S': [
            ...ORDER_EVENT_CODES,
            ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
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
        eventCode: hit['_source'].eventCode.S,
        isStricken: hit['_source'].isStricken.BOOL,
        servedAt: hit['_source'].servedAt.S,
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

const getCaseInfo = async docketNumber => {
  const data = await dynamodb
    .getItem({
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      Key: {
        pk: {
          S: `case|${docketNumber}`,
        },
        sk: {
          S: `case|${docketNumber}`,
        },
      },
      // ProjectionExpression: 'otherFilers, otherPetitioners, #status',
      ProjectionExpression: 'petitioners, #status',
      TableName,
    })
    .promise();
  if (!data || !data.Item) return false;
  if (
    // data.Item.otherPetitioners.L.length === 0 &&
    // data.Item.otherFilers.L.length === 0
    data.Item.petitioners.L.length === 0
  )
    return false;

  return {
    docketNumber,
    // otherFilers: data.Item.otherFilers.L.length,
    // otherPetitioners: data.Item.otherPetitioners.L.length,
    petitioners: data.Item.petitioners.L.length,
    status: data.Item.status.S,
  };
};

const lookupDocketNumbers = async docketNumbers => {
  const cases = [];

  for await (let docketNumber of docketNumbers) {
    const res = await getCaseInfo(docketNumber);
    if (res) {
      cases.push(res);
      console.log(res);
    }
  }

  return cases;
};

(async () => {
  // get all of the docket entries served after startDate
  const startDate = '2021-03-31T19:58:20.793Z'; // '2020-11-25';
  const docketEntries = await findDocketEntries(startDate);

  // get the distinct docket numbers
  const docketNumbers = new Set(docketEntries.map(entry => entry.docketNumber));
  console.log(docketNumbers);

  // lookup the case information
  const cases = await lookupDocketNumbers(docketNumbers);

  console.log(
    `found ${cases.length} total cases that have otherFilers / otherPetitioners`,
  );

  // output the case information
  const results = docketEntries
    .map(docketEntry => {
      const caseEntity = cases.find(
        c => c.docketNumber === docketEntry.docketNumber,
      );

      if (!caseEntity) return null;

      return {
        ...caseEntity,
        ...docketEntry,
      };
    })
    .filter(Boolean);

  results.forEach(row => {
    console.log(
      [
        row.docketNumber,
        // row.otherFilers,
        // row.otherPetitioners,
        // row.status,
        // row.eventCode,
        // row.isStricken,
        // row.servedAt,
        row.docketEntryId,
      ].join(','),
    );
  });
})();
