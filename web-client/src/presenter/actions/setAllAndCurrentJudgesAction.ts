import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.legacyAndCurrentJudges and state.judges based on the role of judges in props.user.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.props the cerebral props object containing the props.user
 * @param {object} providers.store the cerebral store used for setting the state.legacyAndCurrentJudges and state.judges
 */
export const setAllAndCurrentJudgesAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { USER_ROLES } = applicationContext.getConstants();

  const currentJudges = props.users.filter(
    judge => judge.role === USER_ROLES.judge,
  );

  store.set(state.legacyAndCurrentJudges, props.users);
  store.set(state.judges, currentJudges);
};
