import { deleteValidationErrorMessageAction } from '@web-client/presenter/actions/deleteValidationErrorMessageAction';

export const deleteValidationErrorMessageSequence = [
  deleteValidationErrorMessageAction,
] as unknown as (props: {
  validationKey: (string | { property: string; value: any })[];
}) => void;
