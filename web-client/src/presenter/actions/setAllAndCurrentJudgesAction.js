import { state } from 'cerebral';

/**
 * sets the state.allJudges and state.currentJudges based on the role of judges in props.user.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.props the cerebral props object containing the props.user
 * @param {object} providers.store the cerebral store used for setting the state.allJudges and state.currentJudges
 */
export const setAllAndCurrentJudgesAction = ({
  applicationContext,
  props,
  store,
}) => {
  const { USER_ROLES } = applicationContext.getConstants();
  const currentJudges = props.users.filter(
    judge => judge.role === USER_ROLES.judge,
  );

  store.set(state.allJudges, props.users);
  store.set(state.currentJudges, currentJudges);
};
