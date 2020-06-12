import { canRequestAccessAction } from '../actions/CaseAssociationRequest/canRequestAccessAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setRequestAccessWizardStepActionGenerator } from '../actions/setRequestAccessWizardStepActionGenerator';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoRequestAccess = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  getCaseAssociationAction,
  setCaseAssociationAction,
  canRequestAccessAction,
  {
    proceed: [
      setDefaultFileDocumentFormValuesAction,
      runPathForUserRoleAction,
      {
        irsPractitioner: [
          set(state.form.partyIrsPractitioner, true),
          setRequestAccessWizardStepActionGenerator('RequestAccess'),
          setCurrentPageAction('RequestAccessWizard'),
        ],
        privatePractitioner: [
          set(state.form.partyPrivatePractitioner, true),
          setRequestAccessWizardStepActionGenerator('RequestAccess'),
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
