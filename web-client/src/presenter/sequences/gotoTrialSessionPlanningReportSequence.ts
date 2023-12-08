import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
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
    unauthorized: [navigateToLoginSequence],
  },
];
