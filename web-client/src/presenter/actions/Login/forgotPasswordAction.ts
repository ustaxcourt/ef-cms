import { state } from '@web-client/presenter/app.cerebral';

export const forgotPasswordAction = ({ get }) => {
  const form = get(state.authentication.form);
  console.log('form after submit', form);
};
