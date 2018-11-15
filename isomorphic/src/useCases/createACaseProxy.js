const axios = require('axios');

module.exports = async (baseUrl, caseToCreate, user) => {
  const headers = {
    Authorization: `Bearer ${user.name}`,
  };
  const response = await axios.post(`${baseUrl}/cases`, caseToCreate, {
    headers,
  });
  return response.data;
};
