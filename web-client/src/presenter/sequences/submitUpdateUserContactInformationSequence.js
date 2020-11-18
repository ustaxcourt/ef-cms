import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateUserContactInformationAction } from '../actions/updateUserContactInformationAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const submitUpdateUserContactInformationSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateUserContactAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      setWaitingForResponseAction,
      startWebSocketConnectionAction,
      {
        error: [
          unsetWaitingForResponseAction,
          setShowModalFactoryAction('WebSocketErrorModal'),
        ],
        success: [
          setCurrentPageAction('Interstitial'),
          updateUserContactInformationAction,
        ],
      },
    ],
  },
];
