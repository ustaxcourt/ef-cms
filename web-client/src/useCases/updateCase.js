import User from '../../../isomorphic/src/entities/User';

export default async (baseUrl, persistenceGateway, rawCase, rawUser) => {
  const user = new User(rawUser);
  await persistenceGateway.updateCase(user.name, rawCase, baseUrl);
};
