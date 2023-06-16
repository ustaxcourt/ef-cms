import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.screenMetadata.draftDocketEntryId based on the props.docketEntryId passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.draftDocketEntryId
 * @param {object} providers.props the cerebral props object used for passing the props.docketEntryId
 */
export const setDefaultDraftDocumentIdAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.draftDocumentViewerDocketEntryId, props.docketEntryId);
};
