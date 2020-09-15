import { state } from 'cerebral';

/**
 * unset state.docketEntryId
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetDocketEntryIdAction = ({ store }) => {
  store.unset(state.docketEntryId);
};
