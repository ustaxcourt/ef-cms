export default async (applicationContext, userToken) => {
  const persistenceGateway = applicationContext.getPersistenceGateway();
  const baseUrl = applicationContext.getBaseUrl();
  const cases = await persistenceGateway.getPetitionsClerkCaseList(
    baseUrl,
    userToken,
  );
  return cases;
};
