/**
 * This script is to scour elasticsearch and report the docket-numbers for any case that has
 * a document with a specified eventCode
 *
 * Usage:
 *
 *  node find-cases-with-event-codes.js <ENVIRONMENT> <EVENTCODE>
 */

const { checkEnvVar } = require('../util');
const { getClient } = require('../../../web-api/elasticsearch/client');

const { ENV } = process.env;
const eventCode = process.argv[2];

checkEnvVar(ENV, 'You must have ENV specified in your local environment');
checkEnvVar(
  eventCode,
  `Please specify an Event Code: 
  
$ node find-cases-with-event-codes.js <EVENTCODE>`,
);
checkEnvVar(ENV, 'You must have ENV set in your environment; (e.g., mig)');

const findDocumentsByEventCode = async () => {
  const esClient = await getClient({ environmentName: ENV });
  const body = {
    query: {
      term: {
        'eventCode.S': {
          value: eventCode,
        },
      },
    },
    size: 100,
  };
  const res = await esClient.search({
    _source: ['docketNumber.S', 'pk.S'],
    body,
    index: 'efcms-docket-entry',
  });
  return res.hits.hits;
};

(async () => {
  const docs = await findDocumentsByEventCode();

  const docketNumbers = new Set(
    docs.map(hit => {
      console.log(hit);

      return hit['_source'].docketNumber?.S
        ? hit['_source'].docketNumber?.S
        : hit['_source'].pk?.S.split('|')[1];
    }),
  );
  console.log(docketNumbers);
})();
