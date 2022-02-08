import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDefaultSealDocketEntryModalStateAction } from '../actions/CaseDetail/setDefaultSealDocketEntryModalStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const openSealDocketEntryModalSequence = [
  clearModalStateAction,
  setDefaultSealDocketEntryModalStateAction,
  setShowModalAction,
];
