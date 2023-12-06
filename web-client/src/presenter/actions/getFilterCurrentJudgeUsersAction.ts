/**
 * returns all current judges
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.props the cerebral props object containing the props.users
 * @returns {object} providers.props the cerebral props object containing the props.users
 */
export const getFilterCurrentJudgeUsersAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const { USER_ROLES } = applicationContext.getConstants();
  const currentJudges = props.users.filter(
    judge => judge.role === USER_ROLES.judge,
  );

  return { users: currentJudges };
};
