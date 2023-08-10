import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoTrialSessionPlanningReport =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('TrialSessionPlanningReport'),
  ]);

export const gotoTrialSessionPlanningReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionPlanningReport,
    unauthorized: [redirectToCognitoAction],
  },
];
