const { post } = require('../requests');

/**
 * updateOtherStatisticsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to add notes to
 * @param {string} providers.caseNote the notes to add
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateOtherStatisticsInteractor = ({
  applicationContext,
  caseId,
  damages,
  litigationCosts,
}) => {
  return post({
    applicationContext,
    body: { damages, litigationCosts },
    endpoint: `/case-meta/${caseId}/statistics`,
  });
};
