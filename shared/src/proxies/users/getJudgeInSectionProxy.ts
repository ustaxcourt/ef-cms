const { get } = require('../requests');

/**
 * getJudgeInSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to find the judge in
 * @returns {Promise<*>} the promise of the api call
 */
exports.getJudgeInSectionInteractor = (applicationContext, { section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/judge`,
  });
};
