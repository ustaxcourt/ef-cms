import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
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
    unauthorized: [gotoLoginSequence],
  },
];
