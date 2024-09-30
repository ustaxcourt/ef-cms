import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const setIsNotLoadingSequence = [
  unsetWaitingForResponseAction,
] as unknown as () => void;
