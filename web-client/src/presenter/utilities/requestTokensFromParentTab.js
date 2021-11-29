export const requestTokensFromParentTab = async ({
  applicationContext,
  presenter,
  redirect,
}) => {
  let startRefreshSequence = false;

  try {
    await new Promise((resolve, reject) => {
      const rejectTimeout = setTimeout(() => {
        reject();
      }, 1000);

      const broadcastGateway = applicationContext.getBroadcastGateway();
      broadcastGateway.onmessage = msg => {
        switch (msg.subject) {
          case 'receiveToken':
            presenter.state.refreshToken = msg.refreshToken;
            presenter.state.token = msg.token;
            applicationContext.setCurrentUserToken(msg.token);
            startRefreshSequence = true;
            clearTimeout(rejectTimeout);
            resolve();
            break;
        }
      };
      broadcastGateway.postMessage({ subject: 'requestToken' });
    });
  } catch (err) {
    redirect(presenter.state.cognitoLoginUrl);
    return false;
  }

  const user = await applicationContext
    .getUseCases()
    .getUserInteractor(applicationContext);
  presenter.state.user = user;
  applicationContext.setCurrentUser(user);
  return startRefreshSequence;
};
