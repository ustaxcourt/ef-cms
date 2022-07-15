import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { completeMotionStampingAction } from '../actions/completeMotionStampingAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormDateAction } from '../actions/setFormDateAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setSuccessfulStampFromDocumentTitleAction } from '../actions/StampMotion/setSuccessfulStampFromDocumentTitleAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateStampAction } from '../actions/StampMotion/validateStampAction';

export const submitStampMotionSequence = [
  // this is still WIP until the next PR
  startShowValidationAction,
  getComputedFormDateFactoryAction(null),
  setFormDateAction,
  validateStampAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      clearAlertsAction,
      setSaveAlertsForNavigationAction,
      setSuccessfulStampFromDocumentTitleAction,
      completeMotionStampingAction,
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
    ],
  },
];
