import axios from 'axios';

const getDocumentPolicy = async baseUrl => {
  const response = await axios.get(`${baseUrl}/documents/policy`);
  return response.data;
};

const getDocumentId = async (baseUrl, user, type) => {
  const response = await axios.post(`${baseUrl}/documents`, {
    userId: user,
    documentType: type,
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
  formData.append('file', file, 'file.name');
  const result = await axios.post(policy.url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result;
};

const getUser = name => {
  if (name !== 'Test, Taxpayer') throw new Error('Username is incorrect');
  return name;
};

const createPdfPetition = async function createPdfPetition(
  user,
  petition,
  environment,
) {
  const documentPolicy = await getDocumentPolicy(environment.getBaseUrl());
  const petitionFileId = await getDocumentId(
    environment.getBaseUrl(),
    user,
    'petitionFile',
  );
  const requestForPlaceOfTrialId = await getDocumentId(
    environment.getBaseUrl(),
    user,
    'requestForPlaceOfTrial',
  );
  const statementOfTaxpayerIdentificationNumberId = await getDocumentId(
    environment.getBaseUrl(),
    user,
    'statementOfTaxpayerIdentificationNumber',
  );
  await uploadDocumentToS3(
    documentPolicy,
    petitionFileId,
    petition.petitionFile,
  );
  await uploadDocumentToS3(
    documentPolicy,
    requestForPlaceOfTrialId,
    petition.requestForPlaceOfTrial,
  );
  await uploadDocumentToS3(
    documentPolicy,
    statementOfTaxpayerIdentificationNumberId,
    petition.statementOfTaxpayerIdentificationNumber,
  );
};

const awsPersistenceGateway = {
  createPdfPetition,
  getUser,
};

export default awsPersistenceGateway;
