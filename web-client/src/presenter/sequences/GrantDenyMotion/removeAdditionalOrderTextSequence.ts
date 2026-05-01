import { removeAdditionalOrderTextAction } from '@web-client/presenter/actions/GrantDenyMotion/removeAdditionalOrderTextAction';

export const removeAdditionalOrderTextSequence = [
  removeAdditionalOrderTextAction,
] as unknown as (props: { index: number }) => void;
