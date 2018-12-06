const awsDynamoPersistence = require('ef-cms-shared/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('ef-cms-shared/src/persistence/docketNumberGenerator');
const awsS3Persistence = require('ef-cms-shared/src/persistence/awsS3Persistence');
const irsGateway = require('ef-cms-shared/src/persistence/irsGateway');
const { createCase } = require('ef-cms-shared/src/business/useCases/createCase');
const { getCase } = require('ef-cms-shared/src/business/useCases/getCase');
const { getCases } = require('ef-cms-shared/src/business/useCases/getCases');
const { getCasesByStatus } = require('ef-cms-shared/src/business/useCases/getCasesByStatus');
const { getCasesByUser } = require('ef-cms-shared/src/business/useCases/getCasesByUser');
const { getUser } = require('ef-cms-shared/src/business/useCases/getUser');
const { sendPetitionToIRS } = require('ef-cms-shared/src/business/useCases/sendPetitionToIRS');
const { updateCase } = require('ef-cms-shared/src/business/useCases/updateCase');
const { uploadCasePdfs } = require('ef-cms-shared/src/business/useCases/uploadCasePdfs');
const { getCasesByIRSAttorney } = require('ef-cms-shared/src/business/useCases/getCasesByIRSAttorney');

module.exports = {
  persistence: {
    ...awsDynamoPersistence,
    ...awsS3Persistence
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
      createCase,
      getCase,
      getCases,
      getCasesByStatus,
      getCasesByUser,
      getUser,
      sendPetitionToIRS,
      updateCase,
      uploadCasePdfs,
      getCasesByIRSAttorney,
    };
  },
};
