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
  if (name !== 'taxpayer') return;
  return new User({ name });
};

const createCase = async function createCase(
  user,
  petition,
  baseUrl,
  fileHasUploaded,
) {
  const documentPolicy = await getDocumentPolicy(baseUrl);
  const { documentId: petitionFileId } = await createDocumentMetadata(
    baseUrl,
    user,
    'petitionFile',
  );
  const { documentId: requestForPlaceOfTrialId } = await createDocumentMetadata(
    baseUrl,
    user,
    'requestForPlaceOfTrial',
  );
  const {
    documentId: statementOfTaxpayerIdentificationNumberId,
  } = await createDocumentMetadata(
    baseUrl,
    user,
    'statementOfTaxpayerIdentificationNumber',
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
  await createCaseRecord(baseUrl, user.name, {
    documents: [
      {
        documentId: petitionFileId,
        documentType: 'petitionFile',
      },
      {
        documentId: requestForPlaceOfTrialId,
        documentType: 'requestForPlaceOfTrial',
      },
      {
        documentId: statementOfTaxpayerIdentificationNumberId,
        documentType: 'statementOfTaxpayerIdentificationNumber',
      },
    ],
  });
};

const awsPersistenceGateway = {
  createCase,
  getUser,
  getCases,
  getCaseDetail,
};

export default awsPersistenceGateway;
