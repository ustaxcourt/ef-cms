import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDawsonHasUpdatedAction } from '../actions/setDawsonHasUpdatedAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAppUpdatedModalSequence = [
  clearModalStateAction,
  setDawsonHasUpdatedAction,
  setShowModalFactoryAction('AppUpdatedModal'),
];
