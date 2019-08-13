import { state } from 'cerebral';

/**
 * used to determine if a judge is associated with a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @returns {*} returns the next action in the sequence's path
 */
export const isJudgeAssociatedWithTrialSessionAction = ({ get, path }) => {
  const trialSession = get(state.trialSession);
  const user = get(state.user);

  const isJudgeAssociatedWithTrialSession =
    trialSession &&
    trialSession.judge &&
    trialSession.judge.userId === user.userId;

  if (isJudgeAssociatedWithTrialSession) {
    return path.yes();
  } else {
    return path.no();
  }
};
