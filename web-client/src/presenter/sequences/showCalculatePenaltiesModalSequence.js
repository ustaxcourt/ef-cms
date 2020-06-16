import { setDefaultPenaltiesAction } from '../actions/setDefaultPenaltiesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setStatisticIndexAction } from '../actions/setStatisticIndexAction';

export const showCalculatePenaltiesModalSequence = [
  setStatisticIndexAction,
  setDefaultPenaltiesAction,
  setShowModalFactoryAction('CalculatePenaltiesModal'),
];
