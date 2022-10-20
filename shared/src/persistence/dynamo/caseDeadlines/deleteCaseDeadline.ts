import { get, remove } from '../../dynamodbClientService';

/**
 * deleteCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseDeadlineId the id of the case deadline to delete
 * @param {string} providers.docketNumber the docket number of the case the deadline is attached to
 * @returns {Array<Promise>} the promises for the persistence delete calls
 */
export const deleteCaseDeadline = async ({
  applicationContext,
  caseDeadlineId,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  caseDeadlineId: string;
  docketNumber: string;
}) => {
  const originalCaseDeadline = await get({
    Key: {
      pk: `case-deadline|${caseDeadlineId}`,
      sk: `case-deadline|${caseDeadlineId}`,
    },
    applicationContext,
  });

  if (originalCaseDeadline) {
    await Promise.all([
      remove({
        applicationContext,
        key: {
          pk: `case-deadline|${caseDeadlineId}`,
          sk: `case-deadline|${caseDeadlineId}`,
        },
      }),
      remove({
        applicationContext,
        key: {
          pk: `case|${docketNumber}`,
          sk: `case-deadline|${caseDeadlineId}`,
        },
      }),
    ]);
  }
};
