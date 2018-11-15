// import Case from '../../../isomorphic/src/entities/Case';

export default async (applicationContext, rawCase, rawUser) => {
  const caseDetails = new Case(rawCase);
  const user = new User(rawUser);
  await applicationContext
    .getPersistenceGateway()
    .createCase(applicationContext, caseDetails, user);
};
