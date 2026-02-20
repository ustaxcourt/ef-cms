import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { getUserPendingEmailAction } from '../actions/getUserPendingEmailAction';
import { isInternalUserAction } from '../actions/isInternalUserAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setUserPendingEmailAction } from '../actions/setUserPendingEmailAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupPetitionerContactInformationFormAction } from '../actions/setupPetitionerContactInformationFormAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditPetitionerInformationInternalSequence =
  startWebSocketConnectionSequenceDecorator(
    showProgressSequenceDecorator([
      clearAlertsAction,
      clearErrorAlertsAction,
      setupCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      getCaseMetadataAction,
      setCaseMetadataAction,
      setupPetitionerContactInformationFormAction,
      isInternalUserAction,
      {
        no: [],
        yes: [getUserPendingEmailAction, setUserPendingEmailAction],
      },
      setupCurrentPageAction('EditPetitionerInformationInternal'),
    ]),
  );
