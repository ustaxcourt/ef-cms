import { state } from 'cerebral';
import Petition from '../entities/petition';

export const getDocumentPolicy = async ({ api, environment }) => {
  const response = await api.getDocumentPolicy(environment.getBaseUrl());
  return {
    response,
  };
};

export const addDocument = async ({ api, environment }) => {
  const response = await api.addDocument(environment.getBaseUrl());
  return {
    response,
  };
};

export const filePetition = async ({ api, environment }) => {
  const response = await api.filePetition(environment.getBaseUrl());
  return {
    response,
  };
};

export const updatePetition = ({ get }) => {
  const rawPetition = get(state.petition);
  const petition = new Petition(rawPetition);
  return { petition: petition.exportPlainObject() };
};
