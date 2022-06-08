import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDefaultUnsealDocketEntryModalStateAction } from '../actions/CaseDetail/setDefaultUnsealDocketEntryModalStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const openUnsealDocketEntryModalSequence = [
  clearModalStateAction,
  setDefaultUnsealDocketEntryModalStateAction,
  setShowModalAction,
];
