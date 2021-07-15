import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 @returns {object} object containing docketEntryId
 */
export const getDocumentIdAction = ({ get }) => {
  return {
    docketEntryId: get(state.docketEntryId),
  };
};
