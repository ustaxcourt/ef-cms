const client = require('../../dynamodbClientService');
const {
  formatDateString,
  formatNow,
  FORMATS,
} = require('../../../business/utilities/DateHandler');

const getNextDocketNumber = async ({ applicationContext, year }) => {
  const id = await applicationContext.getPersistenceGateway().incrementCounter({
    applicationContext,
    key: 'docketNumberCounter',
    year,
  });
  const plus100 = id + 100;
  const lastTwo = year.slice(-2);
  return `${plus100}-${lastTwo}`;
};

const checkCaseExists = async ({ applicationContext, docketNumber }) => {
  const caseMetadata = await client.get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });

  return !!caseMetadata;
};

const MAX_ATTEMPTS = 1;

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {string} the generated docket number
 */
exports.createDocketNumber = async ({ applicationContext, receivedAt }) => {
  const year = receivedAt
    ? formatDateString(receivedAt, FORMATS.YEAR)
    : formatNow(FORMATS.YEAR);

  let attempt = 0;

  const docketNumber = await (async () => {
    while (attempt < MAX_ATTEMPTS) {
      const nextDocketNumber = await getNextDocketNumber({
        applicationContext,
        year,
      });

      const caseExists = await checkCaseExists({
        applicationContext,
        nextDocketNumber,
      });

      if (!caseExists) {
        return nextDocketNumber;
      }

      attempt++;
    }
  })();

  if (docketNumber) {
    return docketNumber;
  } else {
    // be sure case with this docket number doesn't already exist -- if it does, stop!
    const message = 'docket number already exists!';
    applicationContext.logger.error(message, docketNumber);
    applicationContext.notifyHoneybadger(message, docketNumber);
    throw new Error(message);
  }
};
