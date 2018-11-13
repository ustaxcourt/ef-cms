import User from '../../../isomorphic/src/entities/User';
import CaseInitiator from '../../../isomorphic/src/entities/CaseInitiator';

export default async (
  baseUrl,
  persistenceGateway,
  rawCaseInitiator,
  rawUser,
  fileHasUploaded,
) => {
  const caseInitiator = new CaseInitiator(rawCaseInitiator);
  const user = new User(rawUser);
  await persistenceGateway.createCase(
    user,
    caseInitiator,
    baseUrl,
    fileHasUploaded,
  );
};
