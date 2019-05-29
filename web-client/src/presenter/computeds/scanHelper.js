import { state } from 'cerebral';

export const scanHelper = get => {
  const internalRoles = ['petitionsclerk', 'docketclerk', 'seniorattorney'];
  const user = get(state.user);
  const initiateScriptLoaded = get(state.scanner.initiateScriptLoaded);
  const configScriptLoaded = get(state.scanner.configScriptLoaded);

  return {
    hasLoadedScanDependencies: initiateScriptLoaded && configScriptLoaded,
    hasScanFeature: !!(user && user.role && internalRoles.includes(user.role)),
  };
};
