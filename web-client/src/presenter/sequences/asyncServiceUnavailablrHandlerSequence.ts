import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';
import { unsetUserContactEditProgressAction } from '@web-client/presenter/actions/unsetUserContactEditProgressAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const asyncServiceUnavailablrHandlerSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  unsetUserContactEditProgressAction,
  clearModalAction,
  setShowModalFactoryAction('AsyncServiceUnavailableModal'),
];
