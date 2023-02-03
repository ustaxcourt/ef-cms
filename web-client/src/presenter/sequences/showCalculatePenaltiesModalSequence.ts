import { setDefaultPenaltiesAction } from '../actions/setDefaultPenaltiesAction';
import { setModalTitleAction } from '../actions/setModalTitleAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setStatisticIndexAction } from '../actions/setStatisticIndexAction';

export const showCalculatePenaltiesModalSequence = [
  setStatisticIndexAction,
  setModalTitleAction,
  setDefaultPenaltiesAction,
  setShowModalFactoryAction('CalculatePenaltiesModal'),
];
