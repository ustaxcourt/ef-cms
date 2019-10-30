import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setEditPractitionersAction } from '../actions/ManualAssociation/setEditPractitionersAction';
import { state } from 'cerebral';

export const openEditPractitionersModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditPractitionersAction,
  set(state.showModal, 'EditPractitionersModal'),
];
