import { updateAuthenticationFormValueAction } from '@web-client/presenter/actions/Login/updateAuthenticationFormValueAction';

export const updateAuthenticationFormValueSequence = [
  updateAuthenticationFormValueAction,
] as unknown as (props: {
  confirmPassword?: string;
  email?: string;
  password?: string;
}) => void;
