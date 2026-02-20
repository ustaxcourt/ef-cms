import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setDocketEntryIdFromCorrespondenceAction } from '../actions/setDocketEntryIdFromCorrespondenceAction';
import { setDocumentToFormFromCorrespondenceAction } from '../actions/EditUploadCourtIssuedDocument/setDocumentToFormFromCorrespondenceAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditCorrespondenceDocumentSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseMetadataAction,
    setCaseMetadataAction,
    setDocketEntryIdFromCorrespondenceAction,
    setDocumentToFormFromCorrespondenceAction,
    setRedirectUrlAction,
    setupCurrentPageAction('EditCorrespondenceDocument'),
  ]);
