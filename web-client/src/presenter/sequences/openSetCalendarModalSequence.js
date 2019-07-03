import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openSetCalendarModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'SetCalendarModalDialog'),
];
