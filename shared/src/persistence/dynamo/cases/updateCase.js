const client = require('../../dynamodbClientService');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../caseDeadlines/getCaseDeadlinesByDocketNumber');
const { createCaseDeadline } = require('../caseDeadlines/createCaseDeadline');
const { fieldsToOmitBeforePersisting } = require('./createCase');
const { omit } = require('lodash');

/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
exports.updateCase = async ({ applicationContext, caseToUpdate, oldCase }) => {
  const requests = [];

  if (oldCase.associatedJudge !== caseToUpdate.associatedJudge) {
    const deadlines = await getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });
    const updatedDeadlineRequests = deadlines.map(caseDeadline => {
      caseDeadline.associatedJudge = caseToUpdate.associatedJudge;
      return createCaseDeadline({
        applicationContext,
        caseDeadline,
      });
    });
    requests.push(...updatedDeadlineRequests);
  }

  const setLeadCase = caseToUpdate.leadDocketNumber
    ? { gsi1pk: `case|${caseToUpdate.leadDocketNumber}` }
    : {};

  await Promise.all([
    client.put({
      Item: {
        ...setLeadCase,
        ...omit(caseToUpdate, fieldsToOmitBeforePersisting),
        pk: `case|${caseToUpdate.docketNumber}`,
        sk: `case|${caseToUpdate.docketNumber}`,
      },
      applicationContext,
    }),
    ...requests,
  ]);

  return caseToUpdate;
};
