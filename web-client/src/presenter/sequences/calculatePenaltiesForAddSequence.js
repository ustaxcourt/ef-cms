import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setTotalPenaltiesAmountForStatisticAction } from '../actions/setTotalPenaltiesAmountForStatisticAction';

// TODO: delete?

export const calculatePenaltiesForAddSequence = [
  calculatePenaltiesAction,
  setTotalPenaltiesAmountForStatisticAction,
  clearModalAction,
];
