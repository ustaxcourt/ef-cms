import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setInitialTableSortAction } from '../actions/setInitialTableSortAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setTabFromPropsAction } from '../actions/setTabFromPropsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPractitionerDetailSequence = [
  showProgressSequenceDecorator([
    isLoggedInAction,
    {
      isLoggedIn: startWebSocketConnectionSequenceDecorator([
        clearErrorAlertsAction,
        setTabFromPropsAction,
        setInitialTableSortAction,
        getPractitionerDetailAction,
        setPractitionerDetailAction,
        setupCurrentPageAction('PractitionerInformation'),
      ]),
      unauthorized: [redirectToCognitoAction],
    },
  ]),
];
