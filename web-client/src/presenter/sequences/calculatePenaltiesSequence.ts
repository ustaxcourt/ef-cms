import { calculatePenaltiesAction } from '../actions/calculatePenaltiesAction';
import { chooseStatisticValidationStrategyAction } from '../actions/chooseStatisticValidationStrategyAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { setTotalPenaltiesAmountForStatisticAction } from '../actions/setTotalPenaltiesAmountForStatisticAction';
import { validateAddDeficiencyStatisticsSequence } from './validateAddDeficiencyStatisticsSequence';
import { validatePenaltiesAction } from '../actions/validatePenaltiesAction';
import { validatePetitionFromPaperSequence } from './validatePetitionFromPaperSequence';

export const calculatePenaltiesSequence = [
  calculatePenaltiesAction,
  validatePenaltiesAction,
  {
    error: [setModalErrorAction],
    success: [
      setTotalPenaltiesAmountForStatisticAction,
      clearModalStateAction,
      chooseStatisticValidationStrategyAction,
      {
        addEditStatistic: [validateAddDeficiencyStatisticsSequence],
        startCase: [validatePetitionFromPaperSequence],
      },
    ],
  },
];
