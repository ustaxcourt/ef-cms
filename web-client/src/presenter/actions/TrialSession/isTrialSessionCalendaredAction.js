import { state } from 'cerebral';

/**
 * used to determine if the trial session is calendared
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @returns {*} returns the next action in the sequence's path
 */
export const isTrialSessionCalendaredAction = ({ get, path }) => {
  const trialSession = get(state.trialSession);

  const isTrialSessionCalendared = trialSession && trialSession.isCalendared;

  if (isTrialSessionCalendared) {
    return path.yes();
  } else {
    return path.no();
  }
};
