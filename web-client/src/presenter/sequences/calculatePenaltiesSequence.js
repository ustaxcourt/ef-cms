import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { setTotalPenaltiesAmountForStatisticAction } from '../actions/setTotalPenaltiesAmountForStatisticAction';
import { validateAddDeficiencyStatisticsSequence } from './validateAddDeficiencyStatisticsSequence';
import { validatePenaltiesAction } from '../actions/validatePenaltiesAction';

export const calculatePenaltiesSequence = [
  calculatePenaltiesAction,
  validatePenaltiesAction,
  {
    error: [setModalErrorAction],
    success: [
      setTotalPenaltiesAmountForStatisticAction,
      clearModalStateAction,
      validateAddDeficiencyStatisticsSequence,
    ],
  },
];
