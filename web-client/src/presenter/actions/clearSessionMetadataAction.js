import { state } from 'cerebral';

/**
 * resets the state.sessionMetadata which is used throughout the app for
 * storing temporary session metadata values (for instance, the current sort
 * option on the docket record)
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing the sessionMetadata
 */
export const clearSessionMetadataAction = ({ store }) => {
  store.set(state.sessionMetadata, {});
};
