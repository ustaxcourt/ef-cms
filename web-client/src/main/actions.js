import { state } from 'cerebral';

export const specifyPetitionFile = async () => {
  return { documentType: 'petitionFile' };
};

export const specifyRequestForPlaceOfTrial = async () => {
  return { documentType: 'requestForPlaceOfTrial' };
};

export const specifyStatementOfTaxpayerIdentificationNumber = async () => {
  return { documentType: 'statementOfTaxpayerIdentificationNumber' };
};

export const getDocumentPolicy = async ({ api, environment, store, path }) => {
  try {
    const response = await api.getDocumentPolicy(environment.getBaseUrl());
    store.set(state.petition.policy, response);
    return path.success();
  } catch (error) {
    return path.error({ error: 'Document policy retrieval failed' });
  }
};

export const getDocumentId = async ({
  api,
  environment,
  store,
  path,
  get,
  props,
}) => {
  try {
    const response = await api.getDocumentId(
      environment.getBaseUrl(),
      get(state.user),
      get(props.documentType),
    );
    store.set(
      state.petition[get(props.documentType)].documentId,
      response.documentId,
    );
    return path.success();
  } catch (error) {
    return path.error({ error: 'Fetching document ID failed' });
  }
};

export const uploadDocumentToS3 = async ({ api, get, path, props }) => {
  try {
    await api.uploadDocumentToS3(
      get(state.petition.policy),
      get(state.petition[get(props.documentType)].documentId),
      get(state.petition[get(props.documentType)].file),
    );
    return path.success();
  } catch (error) {
    return path.error({ error: 'Uploading document failed' });
  }
};

export const navigateHome = ({ router }) => {
  router.route('/');
};
