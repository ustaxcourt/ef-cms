import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setEditDocketRecordEntryModalStateAction } from '../actions/EditDocketRecordEntry/setEditDocketRecordEntryModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditDocketRecordEntryModalSequence = [
  clearModalStateAction,
  setEditDocketRecordEntryModalStateAction,
  setShowModalFactoryAction('EditDocketRecordEntryModal'),
];
