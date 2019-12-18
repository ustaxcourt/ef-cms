import { state } from 'cerebral';

export const scanHelper = (get, applicationContext) => {
  // Master switch for the time being
  const scanFeatureEnabled = true;

  const user = applicationContext.getCurrentUser();
  const initiateScriptLoaded = get(state.scanner.initiateScriptLoaded);
  const configScriptLoaded = get(state.scanner.configScriptLoaded);
  const applicationForWaiverOfFilingFeeFileCompleted = !!get(
    state.form.applicationForWaiverOfFilingFeeFile,
  );
  const petitionFileCompleted = !!get(state.form.petitionFile);
  const ownershipDisclosureFileCompleted = !!get(
    state.form.ownershipDisclosureFile,
  );
  const stinFileCompleted = !!get(state.form.stinFile);
  const requestForPlaceOfTrialFileCompleted = !!get(
    state.form.requestForPlaceOfTrialFile,
  );

  return {
    applicationForWaiverOfFilingFeeFileCompleted,
    hasLoadedScanDependencies: initiateScriptLoaded && configScriptLoaded,
    hasScanFeature: !!(
      user &&
      user.role &&
      applicationContext.getUtilities().isInternalUser(user.role)
    ),
    ownershipDisclosureFileCompleted,
    petitionFileCompleted,
    requestForPlaceOfTrialFileCompleted,
    scanFeatureEnabled,
    showScannerSourceModal: get(state.showModal) === 'SelectScannerSourceModal',
    sources: get(state.scanner.sources),
    stinFileCompleted,
  };
};
