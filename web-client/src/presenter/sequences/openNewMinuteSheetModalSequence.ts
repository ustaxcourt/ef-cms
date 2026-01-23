import { clearModalStateAction } from '../actions/clearModalStateAction';
import { openNewMinuteSheetModalAction } from '../actions/TrialSessionMinutes/openNewMinuteSheetModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openNewMinuteSheetModalSequence = [
  clearModalStateAction,
  openNewMinuteSheetModalAction,
  setShowModalFactoryAction('NewMinuteSheetModal'),
];
