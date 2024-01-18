import { getUsersInSectionAction } from '@web-client/presenter/actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { resetCustomCaseReportStateAction } from '../actions/resetCustomCaseReportStateAction';
import { setAllAndCurrentJudgesAction } from '@web-client/presenter/actions/setAllAndCurrentJudgesAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoCustomCaseReport = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  resetCustomCaseReportStateAction,
  getUsersInSectionAction({ section: 'judge' }),
  setAllAndCurrentJudgesAction,
  setupCurrentPageAction('CustomCaseReport'),
]);

export const gotoCustomCaseReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoCustomCaseReport],
    unauthorized: [redirectToCognitoAction],
  },
];
