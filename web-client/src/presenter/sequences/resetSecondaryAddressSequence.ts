import { resetContactSecondaryAction } from '@web-client/presenter/actions/StartCaseInternal/resetContactSecondaryAction';

export const resetSecondaryAddressSequence = [
  resetContactSecondaryAction,
] as unknown as (props: { key: string; value: boolean }) => void;
