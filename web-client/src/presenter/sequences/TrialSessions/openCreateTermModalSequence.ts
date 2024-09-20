import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';
import { setupTrialYearsAction } from '@web-client/presenter/actions/setupTrialYearsAction';

export const openCreateTermModalSequence = [
  clearModalStateAction,
  setupTrialYearsAction,
  setShowModalFactoryAction('CreateTermModal'),
];
