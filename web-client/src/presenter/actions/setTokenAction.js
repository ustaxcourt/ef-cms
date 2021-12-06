import { state } from 'cerebral';

export const setTokenAction = async ({ applicationContext, props, store }) => {
  store.set(state.token, props.token);
  store.set(state.refreshToken, props.refreshToken || null);

  applicationContext.setCurrentUserToken(props.token);

  if (process.env.IS_LOCAL) {
    await applicationContext
      .getUseCases()
      .setItemInteractor(applicationContext, {
        key: 'token',
        value: props.token,
      });
  }
};
