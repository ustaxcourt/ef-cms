import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';

export const openCreateTermModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('CreateTermModal'),
];
