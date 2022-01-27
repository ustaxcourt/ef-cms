import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDefaultSealDocketEntryModalStateAction } from '../actions/CaseDetail/setDefaultSealDocketEntryModalStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const openSealDocketEntryModalSequence = [
  // TODO: Can openCleanModalSequence be made into a decorator?
  clearModalStateAction,
  setDefaultSealDocketEntryModalStateAction,
  setShowModalAction,
];
