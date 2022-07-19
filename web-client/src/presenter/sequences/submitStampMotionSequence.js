import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { completeMotionStampingAction } from '../actions/completeMotionStampingAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { navigateToDraftDocumentsAction } from '../actions/navigateToDraftDocumentsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setDefaultDraftDocumentIdAction } from '../actions/setDefaultDraftDocumentIdAction';
import { setFormDateAction } from '../actions/setFormDateAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setSuccessfulStampFromDocumentTitleAction } from '../actions/StampMotion/setSuccessfulStampFromDocumentTitleAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateStampAction } from '../actions/StampMotion/validateStampAction';

export const submitStampMotionSequence = [
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
      setDefaultDraftDocumentIdAction,
      setRedirectUrlAction,
      // // TODO: replace completeWorkItemForDocumentSigningAction
      // completeWorkItemForDocumentSigningAction,
      // // TODO: replace clearPDFSignatureDataAction
      // clearPDFSignatureDataAction,
      clearFormAction,
      setAlertSuccessAction,
      followRedirectAction,
      {
        default: [
          setCaseDetailPageTabActionGenerator('drafts'),
          navigateToDraftDocumentsAction,
        ],
        success: [],
      },
    ],
  },
];
