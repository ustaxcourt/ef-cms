import { state } from '@web-client/presenter/app.cerebral';
/**
 * sets the state.screenMetadata.showNewTab depending on the user role
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.query
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.trialSessionFilters
 */
export const setTrialSessionsTabsToDisplayAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  let showNewTab = ![USER_ROLES.judge, USER_ROLES.chambers].includes(user.role);

  store.set(state.screenMetadata.showNewTab, showNewTab);
};
