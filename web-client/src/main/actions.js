export const getHello = async ({ api, environment }) => {
  const response = await api.getHello(environment.getBaseUrl());
  return {
    response,
  };
};
