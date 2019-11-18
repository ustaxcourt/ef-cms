import { state } from 'cerebral';

/**
 * used to determine if a judge is associated with a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @returns {*} returns the next action in the sequence's path
 */
export const isUserAssociatedWithTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const trialSession = get(state.trialSession);
  const user = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.judge) {
    const isJudgeAssociatedWithTrialSession =
      trialSession &&
      trialSession.judge &&
      trialSession.judge.userId === user.userId;

    if (isJudgeAssociatedWithTrialSession) {
      return path.yes();
    }
  } else if (user.role === USER_ROLES.chambers) {
    const sectionUsers = get(state.users);

    const judgeUser = sectionUsers.find(
      sectionUser => sectionUser.role === USER_ROLES.judge,
    );

    const isJudgeAssociatedWithTrialSession =
      judgeUser &&
      trialSession.judge &&
      trialSession.judge.userId === judgeUser.userId;

    if (isJudgeAssociatedWithTrialSession) {
      return path.yes();
    }
  }
  return path.no();
};
