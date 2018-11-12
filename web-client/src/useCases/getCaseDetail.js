export default async (applicationContext, caseId, userToken) => {
  const persistenceGateway = applicationContext.getPersistenceGateway();
  const baseUrl = applicationContext.getBaseUrl();
  const caseDetail = await persistenceGateway.getCaseDetail(
    caseId,
    baseUrl,
    userToken,
  );
  return caseDetail;
};
