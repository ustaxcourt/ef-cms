const { CHIEF_JUDGE, ROLES } = require('../entities/EntityConstants');

/**
 * creates a filter for the current user based on a qc work item's associatedJudge
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.judgeUser the judgeUser object from state
 * @returns {Function} a filter for the given user work queue
 */

exports.filterQcItemsByAssociatedJudge = ({
  applicationContext,
  judgeUser,
}) => {
  const currentUser = applicationContext.getCurrentUser();

  let judgeFilter = () => true; // pass-through filter by default

  if (judgeUser) {
    judgeFilter = item =>
      item.associatedJudge && item.associatedJudge === judgeUser.name;
  } else if (currentUser.role === ROLES.adc) {
    judgeFilter = item =>
      !item.associatedJudge || item.associatedJudge === CHIEF_JUDGE;
  }

  return judgeFilter;
};
