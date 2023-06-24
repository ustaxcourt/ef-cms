import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the state.sessionMetadata which is used throughout the app for
 * storing temporary session metadata values (for instance, the current sort
 * option on the docket record)
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the sessionMetadata
 */
export const clearSessionMetadataAction = ({ store }: ActionProps) => {
  store.set(state.sessionMetadata, {});
};
