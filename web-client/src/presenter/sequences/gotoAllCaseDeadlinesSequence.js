import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getAllCaseDeadlinesAction } from '../actions/CaseDeadline/getAllCaseDeadlinesAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDateOnCalendarAction } from '../actions/CaseDeadline/setDefaultDateOnCalendarAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoAllCaseDeadlines = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScreenMetadataAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  parallel([
    fetchUserNotificationsSequence,
    getSetJudgesSequence,
    [getAllCaseDeadlinesAction, setCaseDeadlinesAction],
  ]),
  setDefaultDateOnCalendarAction,
  setCurrentPageAction('CaseDeadlines'),
];

export const gotoAllCaseDeadlinesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAllCaseDeadlines,
    unauthorized: [redirectToCognitoAction],
  },
];
