import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openCreateOrderChooseTypeModalSequence = [
  clearFormAction,
  clearAlertsAction,
  setShowModalFactoryAction('CreateOrderChooseTypeModal'),
];
