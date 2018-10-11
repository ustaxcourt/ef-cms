export const getHello = async ({ api, environment }) => {
  const response = await api.getHello(environment.getBaseUrl());
  return {
    response,
  };
};

export const getTrivia = async ({ api, environment }) => {
  const response = await api.getTrivia(environment.getBaseUrl());
  return {
    response,
  };
};
