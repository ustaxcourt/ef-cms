import { put } from '../../dynamodbClientService';

/**
 * createCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {Promise} resolves upon creation of case deadline
 */
export const createCaseDeadline = ({
  applicationContext,
  caseDeadline,
}: {
  applicationContext: IApplicationContext;
  caseDeadline: TCaseDeadline;
}) => {
  const { caseDeadlineId, docketNumber } = caseDeadline;
  return Promise.all([
    put({
      Item: {
        ...caseDeadline,
        pk: `case-deadline|${caseDeadlineId}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
      applicationContext,
    }),
    put({
      Item: {
        pk: `case|${docketNumber}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
      applicationContext,
    }),
  ]);
};
