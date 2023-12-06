import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const openCleanModalSequence = [
  clearModalStateAction,
  setShowModalAction,
];
