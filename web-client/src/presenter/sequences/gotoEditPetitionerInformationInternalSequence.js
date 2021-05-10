import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getUserPendingEmailAction } from '../actions/getUserPendingEmailAction';
import { isInternalUserAction } from '../actions/clearModalAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserPendingEmailAction } from '../actions/setUserPendingEmailAction';
import { setupPetitionerContactInformationFormAction } from '../actions/setupPetitionerContactInformationFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditPetitionerInformationInternalSequence = [
  clearAlertsAction,
  clearErrorAlertsAction,
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  getCaseAction,
  setCaseAction,
  setupPetitionerContactInformationFormAction,
  isInternalUserAction,
  {
    no: [],
    yes: [getUserPendingEmailAction, setUserPendingEmailAction],
  },
  setCurrentPageAction('EditPetitionerInformationInternal'),
];
