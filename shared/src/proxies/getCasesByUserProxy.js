exports.getCasesByUser = async ({ applicationContext }) => {
  const userToken = applicationContext.getCurrentUserToken(); //TODO refactor for jwt

  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/cases`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
