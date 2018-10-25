import { state } from 'cerebral';
import Petition from '../entities/petition';

export const getDocumentPolicy = async ({ api, environment, path }) => {
  let response;
  try {
    response = await api.getDocumentPolicy(environment.getBaseUrl());
    return path.success({ policy: response });
  } catch (error) {
    return path.error({ alertError: 'Document policy retrieval failed' });
  }
};

export const addDocumentToUser = async ({ api, environment }) => {
  const response = await api.addDocumentToUser(environment.getBaseUrl());
  return {
    response,
  };
};

export const uploadDocumentToS3 = async ({ api, get }) => {
  const response = await api.uploadDocumentToS3(
    get(state.petition.policy),
    get(state.petition.petitionFile),
  );
  return {
    response,
  };
};

export const updatePetition = ({ get }) => {
  const rawPetition = get(state.petition);
  const petition = new Petition(rawPetition);
  return { petition: petition.exportPlainObject() };
};
