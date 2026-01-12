import { selectWorkItemAction } from '../actions/selectWorkItemAction';

export const selectWorkItemSequence = [
  selectWorkItemAction,
] as unknown as (props: { workItem: any }) => void;
