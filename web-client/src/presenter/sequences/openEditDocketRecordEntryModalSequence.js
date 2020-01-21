import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setEditDocketEntryMetaModalStateAction } from '../actions/EditDocketRecordEntry/setEditDocketEntryMetaModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditDocketRecordEntryModalSequence = [
  clearModalStateAction,
  setEditDocketEntryMetaModalStateAction,
  setShowModalFactoryAction('EditDocketRecordEntryModal'),
];
