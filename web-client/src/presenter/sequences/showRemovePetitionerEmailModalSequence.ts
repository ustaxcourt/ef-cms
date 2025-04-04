import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const showRemovePetitionerEmailModalSequence = [
  clearModalAction,
  setShowModalFactoryAction('RemovePetitionerEmailModal'),
] as unknown as () => void;
