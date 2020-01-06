import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { updatePetitionFeePaymentAction } from '../actions/updatePetitionFeePaymentAction';
import { validatePetitionFeePaymentAction } from '../actions/validatePetitionFeePaymentAction';

export const updatePetitionFeePaymentSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePetitionFeePaymentAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      setCurrentPageAction('Interstitial'),
      updatePetitionFeePaymentAction,
      setCaseAction,
      set(state.caseDetailPage.showEditPetition, false),
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      setAlertErrorAction,
      navigateToCaseDetailCaseInformationAction,
    ],
  },
];
