import { sequence } from 'cerebral';
import { toggleWorkingCopySortAction } from '../actions/TrialSessionWorkingCopy/toggleWorkingCopySortAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const toggleWorkingCopySortSequence = sequence<{ sortField: string }>([
  toggleWorkingCopySortAction,
  updateTrialSessionWorkingCopyAction,
]);
