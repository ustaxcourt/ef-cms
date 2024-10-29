import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { computeCategoryNameAction } from '../actions/computeCategoryNameAction';
import { createPractitionerDocumentAction } from '../actions/createPractitionerDocumentAction';
import { getUploadPractitionerDocumentAlertSuccessAction } from '../actions/Practitioners/getUploadPractitionerDocumentAlertSuccessAction';
import { navigateToPractitionerDocumentsPageAction } from '../actions/navigateToPractitionerDocumentsPageAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateAddPractitionerDocumentFormAction } from '../actions/validateAddPractitionerDocumentFormAction';

export const submitAddPractitionerDocumentSequence = [
  startShowValidationAction,
  computeCategoryNameAction,
  validateAddPractitionerDocumentFormAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      showProgressSequenceDecorator([createPractitionerDocumentAction]),
      clearAlertsAction,
      clearFormAction,
      getUploadPractitionerDocumentAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToPractitionerDocumentsPageAction,
    ],
  },
];
