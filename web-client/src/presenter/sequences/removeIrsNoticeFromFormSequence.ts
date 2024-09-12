import { removeIrsNoticeFromFormAction } from '@web-client/presenter/actions/removeIrsNoticeFromFormAction';

export const removeIrsNoticeFromFormSequence = [
  removeIrsNoticeFromFormAction,
] as unknown as (props: { index: number }) => void;
