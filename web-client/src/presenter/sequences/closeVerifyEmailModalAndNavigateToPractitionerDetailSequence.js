import { clearModalSequence } from './clearModalSequence';
import { getUserContactEditCompleteAlertSuccessAction } from '../actions/getUserContactEditCompleteAlertSuccessAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';

export const closeVerifyEmailModalAndNavigateToPractitionerDetailSequence = [
  clearModalSequence,
  getUserContactEditCompleteAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToPractitionerDetailAction,
];
