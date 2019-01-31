exports.getSentWorkItemsForSection = async ({
  applicationContext,
  userId,
  section,
}) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/workitems?completed=true&section=${section}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  return response.data;
};
