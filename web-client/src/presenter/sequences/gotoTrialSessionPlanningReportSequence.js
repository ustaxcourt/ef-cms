import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoTrialSessionPlanningReport = [
  setCurrentPageAction('TrialSessionPlanningReport'),
];

export const gotoTrialSessionPlanningReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionPlanningReport,
    unauthorized: [redirectToCognitoAction],
  },
];
