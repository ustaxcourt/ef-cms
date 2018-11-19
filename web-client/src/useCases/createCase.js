import Case from '../../../business/src/entities/Case';
import User from '../../../business/src/entities/User';

export default async (applicationContext, rawCase, rawUser) => {
  const caseDetails = new Case(rawCase);
  const user = new User(rawUser);
  await applicationContext
    .getPersistenceGateway()
    .createCase(applicationContext, caseDetails, user);
};
