import User from '../../../business/src/entities/User';

export default async (baseUrl, persistenceGateway, rawCase, rawUser) => {
  const user = new User(rawUser);
  await persistenceGateway.updateCase(user.userId, rawCase, baseUrl);
};
