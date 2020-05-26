import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setTotalPenaltiesAmountForAddStatisticAction } from '../actions/setTotalPenaltiesAmountForAddStatisticAction';

export const calculatePenaltiesForAddSequence = [
  calculatePenaltiesAction,
  setTotalPenaltiesAmountForAddStatisticAction,
  clearModalAction,
];
