export default async (persistenceGateway, username) => {
  const user = await persistenceGateway.getUser(username);
  return user;
};
