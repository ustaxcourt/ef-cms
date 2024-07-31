import { removeFactOrReasonAction } from '@web-client/presenter/actions/removeFactOrReasonAction';

export const removeFactOrReasonSequence = [
  removeFactOrReasonAction,
] as unknown as (props: { key: string; index: number }) => void;
