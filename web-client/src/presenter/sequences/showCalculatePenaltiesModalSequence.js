import { setDefaultPenaltiesAction } from '../actions/setDefaultPenaltiesAction';
import { showCalculatePenaltiesModalAction } from '../actions/showCalculatePenaltiesModalAction';

export const showCalculatePenaltiesModalSequence = [
  setDefaultPenaltiesAction,
  showCalculatePenaltiesModalAction,
];
