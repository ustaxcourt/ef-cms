import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deletePractitionerDocumentAction } from '../actions/Practitioners/deletePractitionerDocumentAction';
import { getDeletePractitionerDocumentAlertSuccessAction } from '../actions/Practitioners/getDeletePractitionerDocumentAlertSuccessAction';
import { getPractitionerDocumentsAction } from '../actions/getPractitionerDocumentsAction';
import { navigateToPractitionerDocumentsPageAction } from '../actions/navigateToPractitionerDocumentsPageAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPractitionerDocumentsAction } from '../actions/setPractitionerDocumentsAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deletePractitionerDocumentSequence = showProgressSequenceDecorator(
  [
    deletePractitionerDocumentAction,
    {
      error: [setAlertErrorAction],
      success: [
        clearErrorAlertsAction,
        getPractitionerDocumentsAction,
        setPractitionerDocumentsAction,
        getDeletePractitionerDocumentAlertSuccessAction,
        setAlertSuccessAction,
        setSaveAlertsForNavigationAction,
        navigateToPractitionerDocumentsPageAction,
      ],
    },
    clearModalAction,
    clearModalStateAction,
  ],
);
