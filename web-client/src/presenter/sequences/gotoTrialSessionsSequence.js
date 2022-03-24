import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getTrialSessionsBySelectedTabAction } from '../actions/TrialSession/getTrialSessionsBySelectedTabAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setTrialSessionsFiltersAction } from '../actions/TrialSession/setTrialSessionsFiltersAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoTrialSessions = startWebSocketConnectionSequenceDecorator([
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
    [getTrialSessionsBySelectedTabAction, setTrialSessionsAction],
    [
      getUsersInSectionAction({ section: 'judge' }),
      setAllAndCurrentJudgesAction,
    ],
  ]),
  setTrialSessionsFiltersAction,
  setCurrentPageAction('TrialSessions'),
]);

export const gotoTrialSessionsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoTrialSessions],
    unauthorized: [redirectToCognitoAction],
  },
];
