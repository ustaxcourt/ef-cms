/**
 * creates a filter for the current user based on a qc work item's associatedJudge
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.judgeUser the judgeUser object from state
 * @returns {Function} a filter for the given user work queue
 */

export const filterQcItemsByAssociatedJudge = ({
  applicationContext,
  judgeUser,
}) => {
  const currentUser = applicationContext.getCurrentUser();
  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();

  let judgeFilter = () => true; // pass-through filter by default

  if (judgeUser) {
    judgeFilter = item =>
      item.associatedJudge && item.associatedJudge === judgeUser.name;
  } else if (currentUser.role === USER_ROLES.adc) {
    judgeFilter = item =>
      !item.associatedJudge || item.associatedJudge === CHIEF_JUDGE;
  }

  return judgeFilter;
};
