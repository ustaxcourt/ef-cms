import User from '../entities/User';
import CaseInitiator from '../entities/CaseInitiator';

export default async (
  applicationContext,
  rawCaseInitiator,
  rawUser,
  fileHasUploaded,
) => {
  const caseInitiator = new CaseInitiator(rawCaseInitiator);
  const user = new User(rawUser);
  const uploadResults = await applicationContext
    .getPersistenceGateway()
    .uploadCasePdfs(applicationContext, caseInitiator, user, fileHasUploaded);
  return uploadResults;
};
