import { state } from 'cerebral';

/**
 * resets the state.screenMetadata which is used throughout the app for
 * storing temporary screen metadata values (for instance, showing/hiding
 * hints or success messages)
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing the screenMetadata
 */
export const clearScreenMetadataAction = ({ store }) => {
  store.set(state.screenMetadata, {});
};
