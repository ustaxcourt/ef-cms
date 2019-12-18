import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openSetCalendarModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('SetCalendarModalDialog'),
];
