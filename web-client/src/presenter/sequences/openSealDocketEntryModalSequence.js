import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDefaultDocketEntrySealedToAction } from '../actions/CaseDetail/setDefaultDocketEntrySealedToAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const openSealDocketEntryModalSequence = [
  // TODO: Can openCleanModalSequence be made into a decorator?
  clearModalStateAction,
  setDefaultDocketEntrySealedToAction,
  setShowModalAction,
];
