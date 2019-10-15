import { getBlockedCasesByTrialLocationAction } from '../actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setBlockedCasesAction } from '../actions/CaseDetail/setBlockedCasesAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const getBlockedCasesByTrialLocationSequence = [
  set(state.form[props.key], props.value),
  setWaitingForResponseAction,
  getBlockedCasesByTrialLocationAction,
  setBlockedCasesAction,
  unsetWaitingForResponseAction,
];
