import { canRequestAccessAction } from '../actions/CaseAssociationRequest/canRequestAccessAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { setFormPartyTrueAction } from '../actions/AdvancedSearch/setFormPartyTrueAction';
import { setIsExternalConsolidatedCaseGroupEnabledValueAction } from '../actions/FileDocument/setIsExternalConsolidatedCaseGroupEnabledValueAction';
import { setRequestAccessWizardStepActionGenerator } from '../actions/setRequestAccessWizardStepActionGenerator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoRequestAccess = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
  getCaseAssociationAction,
  setCaseAssociationAction,
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS
      .CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS
      .CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key,
  ),
  canRequestAccessAction,
  {
    proceed: [
      setIsExternalConsolidatedCaseGroupEnabledValueAction,
      setDefaultFileDocumentFormValuesAction,
      runPathForUserRoleAction,
      {
        irsPractitioner: [
          setFormPartyTrueAction('partyIrsPractitioner'),
          setRequestAccessWizardStepActionGenerator('RequestAccess'),
          setCurrentPageAction('RequestAccessWizard'),
        ],
        privatePractitioner: [
          setFormPartyTrueAction('partyPrivatePractitioner'),
          setRequestAccessWizardStepActionGenerator('RequestAccess'),
          setCurrentPageAction('RequestAccessWizard'),
        ],
      },
    ],
    unauthorized: [navigateToCaseDetailAction],
  },
]);

export const gotoRequestAccessSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoRequestAccess,
    unauthorized: [redirectToCognitoAction],
  },
];
