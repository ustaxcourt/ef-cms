import { setDefaultPenaltiesAction } from '../actions/setDefaultPenaltiesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const showCalculatePenaltiesModalSequence = [
  setDefaultPenaltiesAction,
  setShowModalFactoryAction('CalculatePenaltiesModal'),
];
