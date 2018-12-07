const {
  createCase,
  createDocumentMetadata,
  getCaseByCaseId,
  getCaseByDocketNumber,
  incrementCounter,
  saveCase,
  getCasesByUser,
  getCasesForRespondent,
  getCasesByStatus,
} = require('ef-cms-shared/src/persistence/awsDynamoPersistence');

const docketNumberGenerator = require('ef-cms-shared/src/persistence/docketNumberGenerator');
const { uploadPdfsForNewCase, uploadPdf } = require('ef-cms-shared/src/persistence/awsS3Persistence');
const { getUploadPolicy } = require('ef-cms-shared/src/persistence/getUploadPolicy');
const { getDownloadPolicyUrl } = require('ef-cms-shared/src/persistence/getDownloadPolicyUrl');

const irsGateway = require('ef-cms-shared/src/external/irsGateway');
const { getCase } = require('ef-cms-shared/src/business/useCases/getCase');
const { getCases } = require('ef-cms-shared/src/business/useCases/getCases');
const { getCasesByStatus: getCasesByStatusUC } = require('ef-cms-shared/src/business/useCases/getCasesByStatus');
const { createCase: createCaseUC } = require('ef-cms-shared/src/business/useCases/createCase');
const { getCasesByUser: getCasesByUserUC } = require('ef-cms-shared/src/business/useCases/getCasesByUser');
const { getUser } = require('ef-cms-shared/src/business/useCases/getUser');
const { sendPetitionToIRS } = require('ef-cms-shared/src/business/useCases/sendPetitionToIRS');
const { updateCase } = require('ef-cms-shared/src/business/useCases/updateCase');
const { uploadCasePdfs } = require('ef-cms-shared/src/business/useCases/uploadCasePdfs');
const { getCasesForRespondent: getCasesForRespondentUC } = require('ef-cms-shared/src/business/useCases/respondent/getCasesForRespondent');

module.exports = {
  getPersistenceGateway: () => {
    return {
      createCase,
      createDocumentMetadata,
      getCaseByCaseId,
      getCaseByDocketNumber,
      incrementCounter,
      saveCase,
      getCasesByUser,
      getCasesForRespondent,
      getCasesByStatus,
      uploadPdfsForNewCase,
      uploadPdf,
      getUploadPolicy,
      getDownloadPolicyUrl,
    }
  },
  docketNumberGenerator,
  irsGateway,
  environment: {
    stage: process.env.STAGE || 'local',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
    documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  },
  getUseCases: () => {
    return {
      createCase: createCaseUC,
      getCase,
      getCases,
      getCasesByStatus: getCasesByStatusUC,
      getCasesByUser: getCasesByUserUC,
      getUser,
      sendPetitionToIRS,
      updateCase,
      uploadCasePdfs,
      getCasesForRespondent: getCasesForRespondentUC,
    };
  },
};
