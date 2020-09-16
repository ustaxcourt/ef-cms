import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setTrialSessionsFiltersAction } from '../actions/TrialSession/setTrialSessionsFiltersAction';
import { setUsersAction } from '../actions/setUsersAction';

const gotoTrialSessions = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  parallel([
    [
      getJudgeForCurrentUserAction,
      setJudgeUserAction,
      getNotificationsAction,
      setNotificationsAction,
    ],
    [getTrialSessionsAction, setTrialSessionsAction],
    [getUsersInSectionAction({ section: 'judge' }), setUsersAction],
  ]),
  setTrialSessionsFiltersAction,
  setCurrentPageAction('TrialSessions'),
];

export const gotoTrialSessionsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoTrialSessions],
    unauthorized: [redirectToCognitoAction],
  },
];
