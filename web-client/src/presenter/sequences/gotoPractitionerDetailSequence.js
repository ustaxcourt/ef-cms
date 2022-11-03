import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setTabFromPropsAction } from '../actions/setTabFromPropsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPractitionerDetailSequence = [
  showProgressSequenceDecorator([
    isLoggedInAction,
    {
      isLoggedIn: startWebSocketConnectionSequenceDecorator([
        clearErrorAlertsAction,
        setTabFromPropsAction,
        getPractitionerDetailAction,
        setPractitionerDetailAction,
        setCurrentPageAction('PractitionerInformation'),
      ]),
      unauthorized: [redirectToCognitoAction],
    },
  ]),
];
