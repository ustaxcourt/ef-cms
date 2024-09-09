import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';

export const setIsLoadingSequence = [
  setWaitingForResponseAction,
] as unknown as () => void;
