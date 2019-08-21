import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getAllCaseDeadlinesAction } from '../actions/CaseDeadline/getAllCaseDeadlinesAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoAddCaseDeadlines = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  getAllCaseDeadlinesAction,
  setCaseDeadlinesAction,
  setCurrentPageAction('CaseDeadlines'),
];

export const gotoAddCaseDeadlinesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddCaseDeadlines,
    unauthorized: [redirectToCognitoAction],
  },
];
