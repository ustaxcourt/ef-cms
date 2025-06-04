import { setRemovePetitionerEmailAction } from '@web-client/presenter/actions/setRemovePetitionerEmailAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const showRemovePetitionerEmailModalSequence = [
  setRemovePetitionerEmailAction,
  clearModalAction,
  setShowModalFactoryAction('RemovePetitionerEmailModal'),
] as unknown as ({ email }: { email: string }) => void;
