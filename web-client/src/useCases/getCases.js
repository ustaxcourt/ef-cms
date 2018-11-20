export default async (applicationContext, userToken) => {
  const persistenceGateway = applicationContext.getPersistenceGateway();
  const baseUrl = applicationContext.getBaseUrl();
  const cases = await persistenceGateway.getCasesByUser(baseUrl, userToken);
  return cases;
};
