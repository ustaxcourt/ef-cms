import { getScanModeLabel } from '../../utilities/getScanModeLabel';
import { state } from 'cerebral';

const getCaseDocumentByDocumentType = ({ documents, documentType }) => {
  return documents?.find(doc => doc.documentType === documentType);
};

export const scanHelper = (get, applicationContext) => {
  // Master switch for the time being
  const scanFeatureEnabled = true;

  const { INITIAL_DOCUMENT_TYPES_MAP, SCAN_MODES } =
    applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const formCaseDocuments = get(state.form.docketEntries);
  const initiateScriptLoaded = get(state.scanner.initiateScriptLoaded);
  const configScriptLoaded = get(state.scanner.configScriptLoaded);

  let applicationForWaiverOfFilingFeeFileCompleted;
  let petitionFileCompleted;
  let ownershipDisclosureFileCompleted;
  let stinFileCompleted;
  let requestForPlaceOfTrialFileCompleted;

  applicationForWaiverOfFilingFeeFileCompleted =
    !!get(state.form.applicationForWaiverOfFilingFeeFile) ||
    !!getCaseDocumentByDocumentType({
      documentType:
        INITIAL_DOCUMENT_TYPES_MAP.applicationForWaiverOfFilingFeeFile,
      documents: formCaseDocuments,
    });

  petitionFileCompleted =
    !!get(state.form.petitionFile) ||
    !!getCaseDocumentByDocumentType({
      documentType: INITIAL_DOCUMENT_TYPES_MAP.petitionFile,
      documents: formCaseDocuments,
    });

  ownershipDisclosureFileCompleted =
    !!get(state.form.ownershipDisclosureFile) ||
    !!getCaseDocumentByDocumentType({
      documentType: INITIAL_DOCUMENT_TYPES_MAP.ownershipDisclosureFile,
      documents: formCaseDocuments,
    });

  stinFileCompleted =
    !!get(state.form.stinFile) ||
    !!getCaseDocumentByDocumentType({
      documentType: INITIAL_DOCUMENT_TYPES_MAP.stinFile,
      documents: formCaseDocuments,
    });

  requestForPlaceOfTrialFileCompleted =
    !!get(state.form.requestForPlaceOfTrialFile) ||
    !!getCaseDocumentByDocumentType({
      documentType: INITIAL_DOCUMENT_TYPES_MAP.requestForPlaceOfTrialFile,
      documents: formCaseDocuments,
    });

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
