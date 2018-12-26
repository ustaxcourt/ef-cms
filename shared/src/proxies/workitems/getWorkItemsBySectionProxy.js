const axios = require('axios');

exports.getWorkItemsBySection = async ({
  applicationContext,
  userId,
  section,
}) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/workitems?section=${section}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
