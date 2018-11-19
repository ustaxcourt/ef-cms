import axios from 'axios';

import Case from '../../../business/src/entities/Case';

const getDocumentPolicy = async baseUrl => {
  const response = await axios.get(`${baseUrl}/documents/uploadPolicy`);
  return response.data;
};

const getCases = async (baseUrl, userToken) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  return await axios.get(`${baseUrl}/cases`, { headers }).then(response => {
    if (!(response.data && Array.isArray(response.data))) {
      return response.data;
    } else {
      // TODO: remove this once backend can sort
      response.data.sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    return response.data;
  });
};

const getPetitionsClerkCaseList = async (baseUrl, userToken) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  return await axios
    .get(`${baseUrl}/cases?status=new`, { headers })
    .then(response => {
      if (!(response.data && Array.isArray(response.data))) {
        return response.data;
      } else {
        // TODO: remove this once backend can sort
        response.data.sort(function(a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
      }
      return response.data;
    });
};

const getCaseDetail = async (caseId, baseUrl, userToken) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  const response = await axios.get(`${baseUrl}/cases/${caseId}`, { headers });
  return response.data;
};

const createDocumentMetadata = async (baseUrl, user, type) => {
  const response = await axios.post(`${baseUrl}/documents`, {
    userId: user,
    documentType: type,
  });
  return response.data;
};

const updateCase = async (userToken, caseDetails, baseUrl) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  const response = await axios.put(
    `${baseUrl}/cases/${caseDetails.caseId}`,
    caseDetails,
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
    policy.fields['X-Amz-Security-Token'],
  );
  formData.append('Policy', policy.fields.Policy);
  formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
  formData.append('Content-Type', 'application/pdf');
  formData.append('file', file, file.name || 'fileName');
  const result = await axios.post(policy.url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
    user,
    'petitionFile',
  );
  const { documentId: requestForPlaceOfTrialId } = await createDocumentMetadata(
    applicationContext.getBaseUrl(),
    user,
    'requestForPlaceOfTrial',
  );
  const {
    documentId: statementOfTaxpayerIdentificationNumberId,
  } = await createDocumentMetadata(
    applicationContext.getBaseUrl(),
    user,
    'statementOfTaxpayerIdentificationNumber',
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
  getCaseDetail,
  getCases,
  getPetitionsClerkCaseList,
  updateCase,
  uploadCasePdfs,
};

export default awsPersistenceGateway;
