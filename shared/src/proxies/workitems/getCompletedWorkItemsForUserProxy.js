exports.getCompletedWorkItemsForUser = async ({
  applicationContext,
  userId,
}) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/workitems?completed=true`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
