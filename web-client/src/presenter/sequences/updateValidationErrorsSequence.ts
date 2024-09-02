import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';

export const updateValidationErrorsSequence = [
  setValidationErrorsAction,
] as unknown as (props: { errors: any }) => void;
