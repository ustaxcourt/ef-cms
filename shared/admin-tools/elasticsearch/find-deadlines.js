const {
  createApplicationContext,
} = require('../../../web-api/src/applicationContext');
const { Case } = require('../../src/business/entities/cases/Case');
const { DynamoDB } = require('aws-sdk');
const { getClient } = require('../../../web-api/elasticsearch/client');

const applicationContext = createApplicationContext({});

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const dynamodb = new DynamoDB({ region: 'us-east-1' });

const loadCase = async docketNumber => {
  const result = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: `case|${docketNumber}`,
        },
        sk: {
          S: `case|${docketNumber}`,
        },
      },
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  return DynamoDB.Converter.unmarshall(result.Item);
};

(async () => {
  const esClient = await getClient({ environmentName, version });
  const startDate = '2021-01-22T05:00:00.000Z';
  const endDate = '2021-01-24T04:59:59.999Z';
  const queryArray = [
    {
      range: {
        'deadlineDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          gte: startDate,
        },
      },
    },
    {
      range: {
        'deadlineDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          lte: endDate,
        },
      },
    },
  ];

  // if (judge) {
  //   queryArray.push({
  //     match: {
  //       'associatedJudge.S': { operator: 'and', query: judge },
  //     },
  //   });
  // }
  const from = 0;
  const size = 100;

  const query = {
    body: {
      from,
      query: {
        bool: {
          must: queryArray,
        },
      },
      size,
      sort: [
        { 'deadlineDate.S': { order: 'asc' } },
        { 'sortableDocketNumber.N': { order: 'asc' } },
      ],
    },
    index: 'efcms-case-deadline',
  };

  const results = await esClient.search(query);
  const docketNumbers = results.body.hits.hits.map(
    row => row['_source']['docketNumber']['S'],
  );
  const records = await Promise.all(docketNumbers.map(loadCase));

  records.forEach(record => {
    console.log(record.docketNumber);
    const caseEntity = new Case(
      {
        ...record,
      },
      { applicationContext },
    );
    try {
      caseEntity.validate();
    } catch (err) {
      console.log(err);
      console.log(caseEntity.getFormattedValidationErrors());
      console.log(record);
    }
    console.log('------');
  });

  // const validatedCaseData = Case.validateRawCollection(records, {
  //   applicationContext,
  // });
})();
