import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDefaultDockeEntrySealedToAction } from '../actions/CaseDetail/setDefaultDockeEntrySealedToAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const openSealDocketEntryModalSequence = [
  // TODO: Can openCleanModalSequence be made into a decorator?
  clearModalStateAction,
  setDefaultDockeEntrySealedToAction,
  setShowModalAction,
];
