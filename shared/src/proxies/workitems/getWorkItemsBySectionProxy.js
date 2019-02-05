exports.getWorkItemsBySection = async ({
  applicationContext,
  section,
}) => {
  const userToken = applicationContext.getCurrentUser().userId; //TODO refactor for jwt

  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/workitems?section=${section}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
