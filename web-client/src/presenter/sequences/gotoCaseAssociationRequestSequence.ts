import { canRequestAccessAction } from '../actions/CaseAssociationRequest/canRequestAccessAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setCaseAssociationRequestStepActionGenerator } from '../actions/setCaseAssociationRequestStepActionGenerator';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setFormPartyTrueAction } from '../actions/AdvancedSearch/setFormPartyTrueAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoCaseAssociationRequestSequence =
  startWebSocketConnectionSequenceDecorator([
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
      no: [navigateToCaseDetailAction],
      yes: [
        setDefaultFileDocumentFormValuesAction,
        runPathForUserRoleAction,
        {
          irsPractitioner: [
            setFormPartyTrueAction('partyIrsPractitioner'),
            setCaseAssociationRequestStepActionGenerator(
              'CaseAssociationRequest',
            ),
            setupCurrentPageAction('CaseAssociationRequestWizard'),
          ],
          privatePractitioner: [
            setFormPartyTrueAction('partyPrivatePractitioner'),
            setCaseAssociationRequestStepActionGenerator(
              'CaseAssociationRequest',
            ),
            setupCurrentPageAction('CaseAssociationRequestWizard'),
          ],
        },
      ],
    },
  ]);
