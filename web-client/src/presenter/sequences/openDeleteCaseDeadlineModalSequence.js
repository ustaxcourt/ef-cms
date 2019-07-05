import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setCaseDeadlineFormAction } from '../actions/CaseDeadline/setCaseDeadlineFormAction';
import { state } from 'cerebral';

export const openDeleteCaseDeadlineModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setCaseDeadlineFormAction,
  set(state.showModal, 'DeleteCaseDeadlineModalDialog'),
];
