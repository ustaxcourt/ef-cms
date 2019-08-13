import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 @returns {object} object containing documentId
 */
export const getDocumentIdAction = async ({ get }) => {
  return {
    documentId: get(state.documentId),
  };
};
