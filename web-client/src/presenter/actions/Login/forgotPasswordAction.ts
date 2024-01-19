import { state } from '@web-client/presenter/app.cerebral';

export const forgotPasswordAction = async ({ applicationContext, get }) => {
  const { email } = get(state.authentication.form);

  console.log('forgotPasswordAction 1', email);

  const result = await applicationContext
    .getUseCases()
    .forgotPasswordInteractor(applicationContext, { email });

  console.log('forgotPasswordAction 2', result);
};
