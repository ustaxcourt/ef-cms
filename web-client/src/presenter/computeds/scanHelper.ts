import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { getScanModeLabel } from '../../utilities/getScanModeLabel';
import { state } from '@web-client/presenter/app.cerebral';

const getCaseDocumentByEventCode = ({ documents, eventCode }) => {
  return documents?.find(doc => doc.eventCode === eventCode);
};

export const scanHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  // Master switch for the time being
  const scanFeatureEnabled = true;

  const { INITIAL_DOCUMENT_TYPES, SCAN_MODES } =
    applicationContext.getConstants();
  const user = get(state.user);
  const formCaseDocuments = get(state.form.docketEntries);
  const initiateScriptLoaded = get(state.scanner.initiateScriptLoaded);
  const configScriptLoaded = get(state.scanner.configScriptLoaded);
  const sources = get(state.scanner.sources);

  const APWFileCompleted =
    !!get(state.form.applicationForWaiverOfFilingFeeFile) ||
    !!getCaseDocumentByEventCode({
      documents: formCaseDocuments,
      eventCode:
        INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
    });

  const PFileCompleted =
    !!get(state.form.petitionFile) ||
    !!getCaseDocumentByEventCode({
      documents: formCaseDocuments,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
    });

  const ATPFileCompleted =
    !!get(state.form.attachmentToPetitionFile) ||
    !!getCaseDocumentByEventCode({
      documents: formCaseDocuments,
      eventCode: INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
    });

  const DISCFileCompleted =
    !!get(state.form.corporateDisclosureFile) ||
    !!getCaseDocumentByEventCode({
      documents: formCaseDocuments,
      eventCode: INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
    });

  const STINFileCompleted =
    !!get(state.form.stinFile) ||
    !!getCaseDocumentByEventCode({
      documents: formCaseDocuments,
      eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
    });

  const RQTFileCompleted =
    !!get(state.form.requestForPlaceOfTrialFile) ||
    !!getCaseDocumentByEventCode({
      documents: formCaseDocuments,
      eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
    });

  const scanModeOptions = Object.keys(SCAN_MODES).map(scanModeKey => {
    const scanMode = SCAN_MODES[scanModeKey];
    return {
      label: getScanModeLabel(applicationContext, scanMode),
      value: scanMode,
    };
  });

  const scanModeNotSelected = !get(state.modal.scanMode);
  const scannerNotSelected = !get(state.modal.scanner);
  const disableModalSelect =
    scanModeNotSelected ||
    scannerNotSelected ||
    !sources ||
    sources.length === 0;

  return {
    APWFileCompleted,
    ATPFileCompleted,
    DISCFileCompleted,
    PFileCompleted,
    RQTFileCompleted,
    STINFileCompleted,
    disableModalSelect,
    hasLoadedScanDependencies: initiateScriptLoaded && configScriptLoaded,
    hasScanFeature: !!applicationContext
      .getUtilities()
      .isInternalUser(user.role),
    scanFeatureEnabled,
    scanModeNotSelected,
    scanModeOptions,
    scannerNotSelected,
    showScannerSourceModal:
      get(state.modal.showModal) === 'SelectScannerSourceModal',
    sources,
  };
};
