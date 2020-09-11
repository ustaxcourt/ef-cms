import { state } from 'cerebral';

/**
 * return prop of primaryDocumentFileId for sequence
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the return props
 */
export const setPrimaryDocumentFileIdPropAction = ({ get }) => {
  const primaryDocumentFileId = get(state.form.docketEntryId);
  return { primaryDocumentFileId };
};
