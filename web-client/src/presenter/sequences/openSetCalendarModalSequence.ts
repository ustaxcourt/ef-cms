import { canSetTrialSessionToCalendarAction } from '../actions/TrialSession/canSetTrialSessionToCalendarAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openSetCalendarModalSequence = [
  canSetTrialSessionToCalendarAction,
  {
    no: [setAlertWarningAction],
    yes: [
      clearModalStateAction,
      setShowModalFactoryAction('SetCalendarModalDialog'),
    ],
  },
];
