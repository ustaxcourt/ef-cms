import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setEditPractitionersAction } from '../actions/ManualAssociation/setEditPractitionersAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditPractitionersModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditPractitionersAction,
  setShowModalFactoryAction('EditPractitionersModal'),
];
