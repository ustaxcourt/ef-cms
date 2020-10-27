const client = require('../../dynamodbClientService');
const {
  formatDateString,
  formatNow,
  FORMATS,
} = require('../../../business/utilities/DateHandler');

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

  const id = await applicationContext.getPersistenceGateway().incrementCounter({
    applicationContext,
    key: 'docketNumberCounter',
    year,
  });
  const plus100 = id + 100;
  const lastTwo = year.slice(-2);
  const docketNumber = `${plus100}-${lastTwo}`;

  const caseMetadata = await client.get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });

  if (caseMetadata) {
    // be sure case with this docket number doesn't already exist -- if it does, stop!
    const message = 'docket number already exists!';
    applicationContext.logger.error(message, docketNumber);
    applicationContext.notifyHoneybadger(message, docketNumber);
    throw new Error(message);
  }

  return docketNumber;
};
