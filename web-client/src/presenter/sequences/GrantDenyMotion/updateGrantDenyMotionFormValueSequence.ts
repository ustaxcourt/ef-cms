import { clearGrantDenyMotionDependentFieldsAction } from '@web-client/presenter/actions/GrantDenyMotion/clearGrantDenyMotionDependentFieldsAction';
import { setFormValueAction } from '@web-client/presenter/actions/setFormValueAction';

export const updateGrantDenyMotionFormValueSequence = [
  setFormValueAction,
  clearGrantDenyMotionDependentFieldsAction,
] as unknown as (props: {
  key: string;
  value: string | boolean | null;
}) => void;
