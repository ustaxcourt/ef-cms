import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setEditPractitionersFormAction } from '../actions/CaseDetail/setEditPractitionersFormAction';
import { state } from 'cerebral';

export const openEditPractitionersModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditPractitionersFormAction,
  set(state.showModal, 'EditPractitionersModal'),
];
