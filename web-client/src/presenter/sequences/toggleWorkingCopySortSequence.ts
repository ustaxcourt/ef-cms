import { toggleWorkingCopySortAction } from '../actions/TrialSessionWorkingCopy/toggleWorkingCopySortAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const toggleWorkingCopySortSequence = [
  toggleWorkingCopySortAction,
  updateTrialSessionWorkingCopyAction,
] as unknown as (props: {
  sortField: string;
  sortOrder: 'asc' | 'desc';
}) => void;
