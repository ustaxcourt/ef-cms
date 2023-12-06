import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { computeCategoryNameAction } from '../actions/computeCategoryNameAction';
import { editPractitionerDocumentAction } from '../actions/editPractitionerDocumentAction';
import { getEditPractitionerDocumentAlertSuccessAction } from '../actions/Practitioners/getEditPractitionerDocumentAlertSuccessAction';
import { navigateToPractitionerDocumentsPageAction } from '../actions/navigateToPractitionerDocumentsPageAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateAddPractitionerDocumentFormAction } from '../actions/validateAddPractitionerDocumentFormAction';

export const submitEditPractitionerDocumentSequence = [
  startShowValidationAction,
  computeCategoryNameAction,
  validateAddPractitionerDocumentFormAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      showProgressSequenceDecorator([editPractitionerDocumentAction]),
      clearAlertsAction,
      clearFormAction,
      getEditPractitionerDocumentAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToPractitionerDocumentsPageAction,
    ],
  },
];
