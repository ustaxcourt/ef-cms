import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersAction } from '../actions/setUsersAction';
import { state } from 'cerebral';

const gotoAddTrialSession = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearFormAction,
  clearScreenMetadataAction,
  getTrialSessionsAction,
  setTrialSessionsAction,
  getUsersInSectionAction({ section: 'judge' }),
  setUsersAction,
  set(state.form.startTimeExtension, 'am'),
  set(state.form.startTimeHours, '10'),
  set(state.form.startTimeMinutes, '00'),
  setCurrentPageAction('AddTrialSession'),
];

export const gotoAddTrialSessionSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddTrialSession,
    unauthorized: [redirectToCognitoAction],
  },
];
