import axios from 'axios';

import Case from '../../../business/src/entities/Case';

const getDocumentPolicy = async baseUrl => {
  const response = await axios.get(`${baseUrl}/documents/uploadPolicy`);
  return response.data;
};

const createDocumentMetadata = async (baseUrl, user, type) => {
  const headers = {
    Authorization: `Bearer ${user}`,
  };
  const response = await axios.post(
    `${baseUrl}/documents`,
    {
      documentType: type,
    },
    {
      headers,
    },
  );
  return response.data;
};

const createCaseRecord = async (baseUrl, userToken, caseToCreate) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  const response = await axios.post(`${baseUrl}/cases`, caseToCreate, {
    headers,
  });
  return response.data;
};

const uploadDocumentToS3 = async (policy, documentId, file) => {
  let formData = new FormData();
  formData.append('key', documentId);
  formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
  formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
  formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
  formData.append(
    'X-Amz-Security-Token',
    policy.fields['X-Amz-Security-Token'] || '',
  );
  formData.append('Policy', policy.fields.Policy);
  formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
  formData.append('Content-Type', 'application/pdf');
  formData.append('file', file, file.name || 'fileName');
  const result = await axios.post(policy.url, formData, {
    headers: {
      'content-type': `multipart/form-data; boundary=${formData._boundary}`,
    },
  });
  return result;
};

const uploadCasePdfs = async function uploadCasePdfs(
  applicationContext,
  caseInitiator,
  user,
  fileHasUploaded,
) {
  const documentPolicy = await getDocumentPolicy(
    applicationContext.getBaseUrl(),
  );
  const { documentId: petitionFileId } = await createDocumentMetadata(
    applicationContext.getBaseUrl(),
    user.userId,
    'Petition',
  );
  const { documentId: requestForPlaceOfTrialId } = await createDocumentMetadata(
    applicationContext.getBaseUrl(),
    user.userId,
    'Request for Place of Trial',
  );
  const {
    documentId: statementOfTaxpayerIdentificationNumberId,
  } = await createDocumentMetadata(
    applicationContext.getBaseUrl(),
    user.userId,
    'Statement of Taxpayer Identification Number',
  );
  await uploadDocumentToS3(
    documentPolicy,
    petitionFileId,
    caseInitiator.petitionFile,
  );
  fileHasUploaded();
  await uploadDocumentToS3(
    documentPolicy,
    requestForPlaceOfTrialId,
    caseInitiator.requestForPlaceOfTrial,
  );
  fileHasUploaded();
  await uploadDocumentToS3(
    documentPolicy,
    statementOfTaxpayerIdentificationNumberId,
    caseInitiator.statementOfTaxpayerIdentificationNumber,
  );
  fileHasUploaded();
  return {
    petitionFileId,
    requestForPlaceOfTrialId,
    statementOfTaxpayerIdentificationNumberId,
  };
};

const createCase = async function createCase(
  applicationContext,
  uploadResults,
  user,
) {
  await createCaseRecord(applicationContext.getBaseUrl(), user.userId, {
    user: user,
    documents: [
      {
        documentId: uploadResults.petitionFileId,
        documentType: Case.documentTypes.petitionFile,
      },
      {
        documentId: uploadResults.requestForPlaceOfTrialId,
        documentType: Case.documentTypes.requestForPlaceOfTrial,
      },
      {
        documentId: uploadResults.statementOfTaxpayerIdentificationNumberId,
        documentType:
          Case.documentTypes.statementOfTaxpayerIdentificationNumber,
      },
    ],
  });
};

const awsPersistenceGateway = {
  createCase,
  uploadCasePdfs,
};

export default awsPersistenceGateway;
