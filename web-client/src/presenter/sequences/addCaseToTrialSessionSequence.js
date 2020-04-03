import { addCaseToTrialSessionAction } from '../actions/CaseDetail/addCaseToTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setNoticesForCalendaredTrialSessionAction } from '../actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateAddToTrialSessionAction } from '../actions/CaseDetail/validateAddToTrialSessionAction';

const showSuccessAlert = [
  clearModalStateAction,
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
];

export const addCaseToTrialSessionSequence = [
  clearScreenMetadataAction,
  startShowValidationAction,
  validateAddToTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: [
      // this is intentionally NOT using showProgressSequenceDecorator
      // because we want the spinner to show until the websocket response is received
      setWaitingForResponseAction,
      clearModalAction,
      addCaseToTrialSessionAction,
      getTrialSessionDetailsAction,
      isTrialSessionCalendaredAction,
      {
        no: [unsetWaitingForResponseAction, showSuccessAlert],
        yes: [
          startWebSocketConnectionAction,
          setNoticesForCalendaredTrialSessionAction,
        ],
      },
    ],
  },
];
