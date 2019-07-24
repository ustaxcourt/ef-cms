import { state } from 'cerebral';

/**
 * resets the state.screenMetadata which is used throughout the app for
 * storing temporary screen metadata values (for instance, showing/hiding
 * hints or success messages)
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the screenMetadata
 */
export const clearScreenMetadataAction = ({ store }) => {
  store.set(state.screenMetadata, {});
};
