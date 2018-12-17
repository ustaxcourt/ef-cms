const axios = require('axios');

exports.getWorkItems = async ({ applicationContext, userId }) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/workitems`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
