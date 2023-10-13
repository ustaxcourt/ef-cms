import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { completeMotionStampingAction } from '../actions/completeMotionStampingAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getDraftDocumentTitleFromStampDataAction } from '../actions/StampMotion/getDraftDocumentTitleFromStampDataAction';
import { navigateToDraftDocumentsAction } from '../actions/navigateToDraftDocumentsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setDefaultDraftDocumentIdAction } from '../actions/setDefaultDraftDocumentIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setSuccessfulStampFromDocumentTitleAction } from '../actions/StampMotion/setSuccessfulStampFromDocumentTitleAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateStampAction } from '../actions/StampMotion/validateStampAction';

export const submitStampMotionSequence = showProgressSequenceDecorator([
  startShowValidationAction,
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
      getDraftDocumentTitleFromStampDataAction,
      completeMotionStampingAction,
      setDefaultDraftDocumentIdAction,
      setRedirectUrlAction,
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
]);
