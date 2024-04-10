import { addFactOrReasonAction } from '@web-client/presenter/actions/addFactOrReasonAction';

export const addFactOrReasonSequence = [
  addFactOrReasonAction,
] as unknown as (props: { key: string }) => void;
