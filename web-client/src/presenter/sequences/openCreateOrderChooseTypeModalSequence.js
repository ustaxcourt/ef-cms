import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openCreateOrderChooseTypeModalSequence = [
  stopShowValidationAction,
  clearFormAction,
  clearAlertsAction,
  setShowModalFactoryAction('CreateOrderChooseTypeModal'),
];
