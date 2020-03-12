import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setEditPrivatePractitionersAction } from '../actions/ManualAssociation/setEditPrivatePractitionersAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditPrivatePractitionersModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditPrivatePractitionersAction,
  setShowModalFactoryAction('EditPrivatePractitionersModal'),
];
