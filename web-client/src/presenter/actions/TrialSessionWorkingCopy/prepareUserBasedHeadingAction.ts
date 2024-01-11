import { state } from '@web-client/presenter/app.cerebral';

/**
 * prepareUserBasedHeadingAction
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {{userHeading: string}} the user-based heading as props
 */
export const prepareUserBasedHeadingAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const currentUser = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const userRole = currentUser.role;
  const formattedTrialSessionDetails = get(state.formattedTrialSessionDetails)!;

  const userHeading =
    userRole === USER_ROLES.judge || userRole === USER_ROLES.chambers
      ? `${formattedTrialSessionDetails.formattedJudge} - Session Copy`
      : `${currentUser.name} - Session Copy`;

  return { userHeading };
};
