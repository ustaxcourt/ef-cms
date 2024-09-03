import { updateValidationErrorsAction } from '@web-client/presenter/actions/updateValidationErrorsAction';

export const updateValidationErrorsSequence = [
  updateValidationErrorsAction,
] as unknown as (props: { errors: any }) => void;
