import { updateEmailConfirmationFormAction } from '@web-client/presenter/actions/updateEmailConfirmationFormAction';

export const updateEmailConfirmationFormSequence = [
  updateEmailConfirmationFormAction,
] as unknown as (props: { field?: string; inFocus?: boolean }) => void;
