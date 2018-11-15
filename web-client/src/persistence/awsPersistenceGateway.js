import axios from 'axios';

import User from '../../../isomorphic/src/entities/User';

const getDocumentPolicy = async baseUrl => {
  const response = await axios.get(`${baseUrl}/documents/uploadPolicy`);
  return response.data;
};

const getCases = async (baseUrl, userToken) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  const response = await axios.get(`${baseUrl}/cases`, { headers });
  return response.data;
};

const getPetitionsClerkCaseList = async (baseUrl, userToken) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  const response = await axios.get(`${baseUrl}/cases?status=new`, { headers });
  return response.data;
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

const getUser = name => {
  if (name === 'taxpayer') return new User({ name, role: 'taxpayer' });
  if (name === 'petitionsclerk')
    return new User({ name, role: 'petitionsclerk' });
  return;
};

const uploadCasePdfs = async function uploadCasePdfs(
  user,
  petition,
  baseUrl,
  fileHasUploaded,
) {
  const documentPolicy = await getDocumentPolicy(baseUrl);
  const { documentId: petitionFileId } = await createDocumentMetadata(
    baseUrl,
    user,
    'Petition file',
  );
  const { documentId: requestForPlaceOfTrialId } = await createDocumentMetadata(
    baseUrl,
    user,
    'Request for place of trial',
  );
  const {
    documentId: statementOfTaxpayerIdentificationNumberId,
  } = await createDocumentMetadata(
    baseUrl,
    user,
    'Statement of Taxpayer Identification number',
  );
  await uploadDocumentToS3(
    documentPolicy,
    petitionFileId,
    petition.petitionFile,
  );
  fileHasUploaded();
  await uploadDocumentToS3(
    documentPolicy,
    requestForPlaceOfTrialId,
    petition.requestForPlaceOfTrial,
  );
  fileHasUploaded();
  await uploadDocumentToS3(
    documentPolicy,
    statementOfTaxpayerIdentificationNumberId,
    petition.statementOfTaxpayerIdentificationNumber,
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
  await createCaseRecord(applicationContext.getBaseUrl(), user.name, {
    documents: [
      {
        documentId: uploadResults.petitionFileId,
        documentType: 'Petition file',
      },
      {
        documentId: uploadResults.requestForPlaceOfTrialId,
        documentType: 'Request for place of trial',
      },
      {
        documentId: uploadResults.statementOfTaxpayerIdentificationNumberId,
        documentType: 'Statement of Taxpayer Identification number',
      },
    ],
  });
};

const awsPersistenceGateway = {
  uploadCasePdfs,
  createCase,
  getCaseDetail,
  getCases,
  getPetitionsClerkCaseList,
  getUser,
  updateCase,
};

export default awsPersistenceGateway;
