import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setTotalPenaltiesAmountForStatisticAction } from '../actions/setTotalPenaltiesAmountForStatisticAction';

export const calculatePenaltiesSequence = [
  calculatePenaltiesAction,
  setTotalPenaltiesAmountForStatisticAction,
  clearModalStateAction,
];
