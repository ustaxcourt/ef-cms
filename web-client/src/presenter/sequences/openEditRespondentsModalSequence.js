import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setEditRespondentsAction } from '../actions/ManualAssociation/setEditRespondentsAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditRespondentsModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setEditRespondentsAction,
  setShowModalFactoryAction('EditRespondentsModal'),
];
