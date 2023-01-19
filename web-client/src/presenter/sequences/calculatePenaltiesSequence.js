import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setTotalPenaltiesAmountForStatisticAction } from '../actions/setTotalPenaltiesAmountForStatisticAction';
import { validatePenaltiesAction } from '../actions/validatePenaltiesAction';

export const calculatePenaltiesSequence = [
  calculatePenaltiesAction,
  validatePenaltiesAction,
  setTotalPenaltiesAmountForStatisticAction,
  clearModalStateAction,
];
