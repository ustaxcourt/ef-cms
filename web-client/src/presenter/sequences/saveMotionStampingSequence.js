import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeMotionStampingAction } from '../actions/completeMotionStampingAction';
import { completeWorkItemForDocumentSigningAction } from '../actions/completeWorkItemForDocumentSigningAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setSuccessfulStampFromDocumentTitleAction } from '../actions/setSuccessfulStampFromDocumentTitleAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const saveMotionStampingSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  setSaveAlertsForNavigationAction,
  setSuccessfulStampFromDocumentTitleAction,
  // completeMotionStampingAction,
  navigateBackAction,
  // // TODO: replace completeWorkItemForDocumentSigningAction
  // completeWorkItemForDocumentSigningAction,
  // // TODO: replace clearPDFSignatureDataAction
  // clearPDFSignatureDataAction,
  clearFormAction,
  setAlertSuccessAction,
  followRedirectAction,
  {
    default: [],
  },
]);
