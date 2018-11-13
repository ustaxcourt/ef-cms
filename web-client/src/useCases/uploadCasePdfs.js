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
  const uploadResults = await persistenceGateway.uploadCasePdfs(
    user,
    caseInitiator,
    baseUrl,
    fileHasUploaded,
  );
  return uploadResults;
};
