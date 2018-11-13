import User from '../../../isomorphic/src/entities/User';
import Case from '../../../isomorphic/src/entities/Case';

export default async (
  baseUrl,
  persistenceGateway,
  rawCase,
  rawUser,
  fileHasUploaded,
) => {
  const caseDetails = new Case(rawCase);
  const user = new User(rawUser);
  await persistenceGateway.createCase(
    user,
    caseDetails,
    baseUrl,
    fileHasUploaded,
  );
};
