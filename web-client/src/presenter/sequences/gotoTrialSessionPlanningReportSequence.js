import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoTrialSessionPlanningReport = [
  setCurrentPageAction('TrialSessionPlanningReport'),
];

export const gotoTrialSessionPlanningReportSequence =
  startWebSocketConnectionSequenceDecorator([
    isLoggedInAction,
    {
      isLoggedIn: gotoTrialSessionPlanningReport,
      unauthorized: [redirectToCognitoAction],
    },
  ]);
