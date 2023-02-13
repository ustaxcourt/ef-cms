import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupTrialYearsAction } from '../actions/setupTrialYearsAction';

export const openTrialSessionPlanningModalSequence = [
  clearModalStateAction,
  setupTrialYearsAction,
  setShowModalFactoryAction('TrialSessionPlanningModal'),
];
