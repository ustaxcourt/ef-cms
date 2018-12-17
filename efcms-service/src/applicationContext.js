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

const { getWorkItemsForUser } = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemsForUser');
const { getWorkItemById } = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemById');
const { saveWorkItem } = require('ef-cms-shared/src/persistence/dynamo/workitems/saveWorkItem');

const docketNumberGenerator = require('ef-cms-shared/src/persistence/docketNumberGenerator');

const { uploadPdfsForNewCase, uploadPdf } = require('ef-cms-shared/src/persistence/awsS3Persistence');
const { getUploadPolicy } = require('ef-cms-shared/src/persistence/getUploadPolicy');
const { getDownloadPolicyUrl } = require('ef-cms-shared/src/persistence/getDownloadPolicyUrl');

const irsGateway = require('ef-cms-shared/src/external/irsGateway');
const { getCase } = require('ef-cms-shared/src/business/useCases/getCase.interactor');
const { getCases } = require('ef-cms-shared/src/business/useCases/getCases.interactor');
const { getCasesByStatus: getCasesByStatusUC } = require('ef-cms-shared/src/business/useCases/getCasesByStatus.interactor');
const { createCase: createCaseUC } = require('ef-cms-shared/src/business/useCases/createCase.interactor');
const { getCasesByUser: getCasesByUserUC } = require('ef-cms-shared/src/business/useCases/getCasesByUser.interactor');
const { getUser } = require('ef-cms-shared/src/business/useCases/getUser.interactor');
const { sendPetitionToIRS } = require('ef-cms-shared/src/business/useCases/sendPetitionToIRS.interactor');
const { updateCase } = require('ef-cms-shared/src/business/useCases/updateCase.interactor');
const { uploadCasePdfs } = require('ef-cms-shared/src/business/useCases/uploadCasePdfs.interactor');
const { getCasesForRespondent: getCasesForRespondentUC } = require('ef-cms-shared/src/business/useCases/respondent/getCasesForRespondent.interactor');
const { getWorkItem } = require('ef-cms-shared/src/business/useCases/workitems/getWorkItem.interactor');
const { getWorkItems } = require('ef-cms-shared/src/business/useCases/workitems/getWorkItems.interactor');
const { updateWorkItem } = require('ef-cms-shared/src/business/useCases/workitems/updateWorkItem.interactor');
const { fileAnswerUpdateCase } = require('ef-cms-shared/src/business/useCases/respondent/fileAnswerUpdateCase.interactor');
const { fileStipulatedDecisionUpdateCase } = require('ef-cms-shared/src/business/useCases/respondent/fileStipulatedDecisionUpdateCase.interactor');

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
      getWorkItemsForUser,
      getWorkItemById,
      saveWorkItem,
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
      getWorkItem,
      getWorkItems,
      updateWorkItem,
      fileAnswerUpdateCase,
      fileStipulatedDecisionUpdateCase,
    };
  },
  getUpdateCaseInteractorQueryParam: event => {
    const interactorName = (event.queryStringParameters || {}).interactorName || "updateCase";
    switch (interactorName) {
    case "fileAnswerUpdateCase":
      return fileAnswerUpdateCase;
    case "fileStipulatedDecisionUpdateCase":
      return fileStipulatedDecisionUpdateCase;
    default:
      return updateCase;
    }
  }
};
