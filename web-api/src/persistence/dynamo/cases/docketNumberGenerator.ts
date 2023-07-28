import {
  FORMATS,
  formatDateString,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { get } from '../../dynamodbClientService';

/**
 * gets the next docket number in the series
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.year the year in which the docket number is to be generator
 * @returns {string} the generated docket number
 */
export const getNextDocketNumber = async ({
  applicationContext,
  year,
}: {
  applicationContext: IApplicationContext;
  year: string;
}) => {
  const id = await applicationContext.getPersistenceGateway().incrementCounter({
    applicationContext,
    key: 'docketNumberCounter',
    year,
  });
  const plus100 = id + 100;
  const lastTwo = year.slice(-2);
  return `${plus100}-${lastTwo}`;
};

/**
 * verifies whether a case already exists with the given docket number
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber a docket number to verify as available
 * @returns {string} the generated docket number
 */
export const checkCaseExists = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}) => {
  const caseMetadata = await get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });

  return !!caseMetadata;
};

export const MAX_ATTEMPTS = 5;

/**
 * creates a new unique docket number
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.receivedAt the receivedAt date for determining the year portion of the docket number
 * @returns {string} the generated docket number
 */
export const createDocketNumber = async ({
  applicationContext,
  receivedAt,
}: {
  applicationContext: IApplicationContext;
  receivedAt: string;
}) => {
  const year = receivedAt
    ? formatDateString(receivedAt, FORMATS.YEAR)
    : formatNow(FORMATS.YEAR);

  let attempt = 0;
  let nextDocketNumber;

  const docketNumber = await (async () => {
    while (attempt < MAX_ATTEMPTS) {
      nextDocketNumber = await getNextDocketNumber({
        applicationContext,
        year,
      });

      const caseExists = await checkCaseExists({
        applicationContext,
        docketNumber: nextDocketNumber,
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
    const message = `${nextDocketNumber}: docket number already exists!`;
    applicationContext.logger.error(message, nextDocketNumber);
    throw new Error(message);
  }
};
