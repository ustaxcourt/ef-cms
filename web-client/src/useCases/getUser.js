export default async (persistenceGateway, userId) => {
  return await persistenceGateway.getUser(userId);
};
