import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openCreateCaseDeadlineModalSequence = [
  stopShowValidationAction,
  clearModalStateAction,
  clearFormAction,
  clearAlertsAction,
  setShowModalFactoryAction('CreateCaseDeadlineModalDialog'),
];
