import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setEditIrsPractitionersAction } from '../actions/ManualAssociation/setEditIrsPractitionersAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditIrsPractitionersModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditIrsPractitionersAction,
  setShowModalFactoryAction('EditIrsPractitionersModal'),
];
