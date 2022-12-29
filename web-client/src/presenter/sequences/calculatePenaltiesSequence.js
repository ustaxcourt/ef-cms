import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
// import { clearModalAction } from '../actions/clearModalAction';
import { formatAndSetPenaltiesAction } from '../actions/formatAndSetPenaltiesAction';
import { setTotalPenaltiesAmountForStatisticAction } from '../actions/setTotalPenaltiesAmountForStatisticAction';

export const calculatePenaltiesSequence = [
  calculatePenaltiesAction,
  setTotalPenaltiesAmountForStatisticAction,
  formatAndSetPenaltiesAction,
  // clearModalAction,
];
