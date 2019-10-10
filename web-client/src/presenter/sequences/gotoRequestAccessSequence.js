import { canRequestAccessAction } from '../actions/CaseAssociationRequest/canRequestAccessAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoRequestAccess = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  getCaseAssociationAction,
  setCaseAssociationAction,
  canRequestAccessAction,
  {
    proceed: [
      getUserRoleAction,
      {
        practitioner: [
          set(state.form.partyPractitioner, true),
          set(state.wizardStep, 'RequestAccess'),
          setCurrentPageAction('RequestAccessWizard'),
        ],
        respondent: [
          set(state.form.partyRespondent, true),
          set(state.wizardStep, 'RequestAccess'),
          setCurrentPageAction('RequestAccessWizard'),
        ],
      },
    ],
    unauthorized: [navigateToCaseDetailAction],
  },
];

export const gotoRequestAccessSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoRequestAccess,
    unauthorized: [redirectToCognitoAction],
  },
];
