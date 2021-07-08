// const createApplicationContext = require('../../../src/applicationContext');

// const applicationContext = createApplicationContext({});

exports.handler = async event => {
  const { body } = event.Records;

  const bodyParsed = JSON.parse(body);

  const record = bodyParsed.Records[0];

  const { key } = record.s3.object;
};
