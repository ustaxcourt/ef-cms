import { setFormValueAction } from '@web-client/presenter/actions/setFormValueAction';

export const updateGrantDenyMotionFormValueSequence = [
  setFormValueAction,
] as unknown as (props: { key: string; value: string | boolean }) => void;
