import { canRequestAccessAction } from '../actions/CaseAssociationRequest/canRequestAccessAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setFormPartyTrueAction } from '../actions/AdvancedSearch/setFormPartyTrueAction';
import { setRequestAccessWizardStepActionGenerator } from '../actions/setRequestAccessWizardStepActionGenerator';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoRequestAccess = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
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
          setFormPartyTrueAction('partyIrsPractitioner'),
          setRequestAccessWizardStepActionGenerator('RequestAccess'),
          setupCurrentPageAction('RequestAccessWizard'),
        ],
        privatePractitioner: [
          setFormPartyTrueAction('partyPrivatePractitioner'),
          setRequestAccessWizardStepActionGenerator('RequestAccess'),
          setupCurrentPageAction('RequestAccessWizard'),
        ],
      },
    ],
    unauthorized: [navigateToCaseDetailAction],
  },
]);

export const gotoRequestAccessSequence = [gotoRequestAccess];
