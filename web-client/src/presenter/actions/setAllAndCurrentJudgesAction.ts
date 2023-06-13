import { state } from 'cerebral';

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
