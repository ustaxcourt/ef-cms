import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { computeTrialSessionStartTimeAction } from '../actions/TrialSession/computeTrialSessionStartTimeAction';
import { getIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/getIrsPractitionerUsersAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/setIrsPractitionerUsersAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionDetailsOnFormAction } from '../actions/TrialSession/setTrialSessionDetailsOnFormAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setTrialStartTimeAction } from '../actions/setTrialStartTimeAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditTrialSession = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getIrsPractitionerUsersAction,
  setIrsPractitionerUsersAction,
  getTrialSessionsAction,
  setTrialSessionsAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  setTrialSessionDetailsOnFormAction,
  computeTrialSessionStartTimeAction,
  setTrialStartTimeAction,
  getSetJudgesSequence,
  getUsersInSectionAction({ section: 'trialClerks' }),
  setUsersByKeyAction('trialClerks'),
  setupCurrentPageAction('EditTrialSession'),
]);

export const gotoEditTrialSessionSequence = [gotoEditTrialSession];
