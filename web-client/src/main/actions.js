import { state } from 'cerebral';
import Petition from '../entities/petition';

export const getDocumentPolicy = async ({ api, environment, store, path }) => {
  let response;
  try {
    response = await api.getDocumentPolicy(environment.getBaseUrl());
    store.set(state.petition.policy, response);
    return path.success();
  } catch (error) {
    store.set(state.alertError, 'Document policy retrieval failed');
  }
};

export const getDocumentId = async ({ api, environment, store, path, get }) => {
  try {
    const response = await api.getDocumentId(
      environment.getBaseUrl(),
      get(state.user),
      'type',
    );
    store.set(state.petition.id, response);
    return path.success();
  } catch (error) {
    store.set(state.alertError, 'Fetching document ID failed');
  }
};

export const uploadDocumentToS3 = async ({ api, get, store }) => {
  try {
    await api.uploadDocumentToS3(
      get(state.petition.policy),
      get(state.petition.petitionFile.file),
    );
  } catch (error) {
    store.set(state.alertError, 'Uploading document failed');
  }
};

export const updatePetition = ({ get }) => {
  const rawPetition = get(state.petition);
  const petition = new Petition(rawPetition);
  return { petition: petition.exportPlainObject() };
};
