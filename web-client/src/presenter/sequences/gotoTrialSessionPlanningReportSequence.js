import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoTrialSessionPlanningReport =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('TrialSessionPlanningReport'),
  ]);

export const gotoTrialSessionPlanningReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionPlanningReport,
    unauthorized: [redirectToCognitoAction],
  },
];
