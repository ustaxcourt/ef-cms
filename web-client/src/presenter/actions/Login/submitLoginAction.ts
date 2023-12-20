import { state } from '@web-client/presenter/app.cerebral';

export const submitLoginAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
}> => {
  const { email, password } = get(state.form);

  const { accessToken, idToken, refreshToken } = await applicationContext
    .getUseCases()
    .loginInteractor(applicationContext, { email, password });

  return {
    accessToken,
    idToken,
    refreshToken,
  };
};
