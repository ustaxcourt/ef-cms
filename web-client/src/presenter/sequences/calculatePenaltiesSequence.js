import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setTotalPenaltiesAmountForStatisticAction } from '../actions/setTotalPenaltiesAmountForStatisticAction';

export const calculatePenaltiesSequence = [
  calculatePenaltiesAction,
  setTotalPenaltiesAmountForStatisticAction,
  clearModalAction,
];
