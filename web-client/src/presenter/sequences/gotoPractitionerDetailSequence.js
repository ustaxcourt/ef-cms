import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

//todo multiple decorators
export const gotoPractitionerDetailSequence =
  startWebSocketConnectionSequenceDecorator([
    showProgressSequenceDecorator([
      isLoggedInAction,
      {
        isLoggedIn: [
          clearErrorAlertsAction,
          getPractitionerDetailAction,
          setPractitionerDetailAction,
          setCurrentPageAction('PractitionerDetail'),
        ],
        unauthorized: [redirectToCognitoAction],
      },
    ]),
  ]);
