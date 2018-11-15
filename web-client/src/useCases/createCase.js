import Case from '../../../isomorphic/src/entities/Case';
import User from '../../../isomorphic/src/entities/User';

export default async (applicationContext, rawCase, rawUser) => {
  const caseDetails = new Case(rawCase);
  const user = new User(rawUser);
  await applicationContext
    .getPersistenceGateway()
    .createCase(applicationContext, caseDetails, user);
};
