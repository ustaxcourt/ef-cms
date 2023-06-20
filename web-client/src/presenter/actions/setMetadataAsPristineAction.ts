import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.screenMetadata.pristine to the props.users passed in.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setMetadataAsPristineAction = ({ store }: ActionProps) => {
  store.set(state.screenMetadata.pristine, true);
};
