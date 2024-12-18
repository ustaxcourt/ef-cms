import { state } from '@web-client/presenter/app.cerebral';

export const getExportTypeAction = ({
  get,
  path,
  props,
  store,
}: ActionProps) => {
  const exportType = get(state.trialLocationPage.currentTab);
  const exportFileString =
    exportType === 'eligibleCases' ? 'Eligible Cases' : 'Blocked Cases';
  store.set(state.trialLocationPage.currentTab, props.currentTab);

  if (exportType === 'eligibleCases') {
    return path.eligibleCases({ exportFileString });
  } else {
    return path.blockedCases({ exportFileString });
  }
};
