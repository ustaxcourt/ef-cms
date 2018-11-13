// import Case from '../../../isomorphic/src/entities/Case';

export default async (applicationContext, uploadResults, user) => {
  // const caseDetail = new Case(rawCase);
  await applicationContext
    .getPersistenceGateway()
    .createCase(applicationContext, uploadResults, user);
};
