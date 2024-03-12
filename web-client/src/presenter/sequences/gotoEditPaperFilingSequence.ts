import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryFormForDocketEditAction } from '../actions/EditDocketRecord/setDocketEntryFormForDocketEditAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setFromPageAction } from '../actions/setFromPageAction';
import { setPdfPreviewUrlForEditPaperFilingAction } from '../actions/EditDocketRecord/setPdfPreviewUrlForEditPaperFilingAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupEditPaperFilingAction } from '../actions/setupEditPaperFilingAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const gotoEditPaperFilingSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearScansAction,
    clearFormAction,
    clearScreenMetadataAction,
    stopShowValidationAction,
    setFromPageAction,
    getCaseAction,
    setCaseAction,
    setDocketEntryIdAction,
    setDocketEntryFormForDocketEditAction,
    updateDocketEntryWizardDataAction,
    setupEditPaperFilingAction,
    setPdfPreviewUrlForEditPaperFilingAction,
    setupCurrentPageAction('PaperFiling'),
  ]);
