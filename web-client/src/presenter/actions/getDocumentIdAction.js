import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.applicationContext needed for getting the getCase use case
 */
export const getDocumentIdAction = async ({ get }) => {
  return {
    documentId: get(state.documentId),
  };
};
