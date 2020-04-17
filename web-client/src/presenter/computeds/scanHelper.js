import { getScanModeLabel } from '../../utilities/getScanModeLabel';
import { state } from 'cerebral';

export const scanHelper = (get, applicationContext) => {
  // Master switch for the time being
  const scanFeatureEnabled = true;

  const { SCAN_MODES } = applicationContext.getConstants();
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

  const scanModeOptions = Object.keys(SCAN_MODES).map(scanModeKey => {
    const scanMode = SCAN_MODES[scanModeKey];
    return {
      label: getScanModeLabel(applicationContext, scanMode),
      value: scanMode,
    };
  });

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
    scanModeOptions,
    showScannerSourceModal:
      get(state.modal.showModal) === 'SelectScannerSourceModal',
    sources: get(state.scanner.sources),
    stinFileCompleted,
  };
};
