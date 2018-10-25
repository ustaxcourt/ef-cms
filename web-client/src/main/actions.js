export const getDocument = async ({ api, environment }) => {
  const response = await api.getDocument(environment.getBaseUrl());
  return {
    response,
  };
};
