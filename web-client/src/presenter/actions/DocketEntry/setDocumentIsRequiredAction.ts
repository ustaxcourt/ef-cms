import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the document as required when saving AND serving a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props cerebral props
 * @param {object} providers.store the cerebral store used for setting the state
 */
export const setDocumentIsRequiredAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const isFileAttached = get(state.form.isFileAttached);
  const { isSavingForLater } = props;
  const documentUploadMode = get(state.currentViewMetadata.documentUploadMode);

  if (
    isSavingForLater ||
    (isFileAttached && documentUploadMode === 'preview')
  ) {
    store.unset(state.form.isDocumentRequired);
  } else if (documentUploadMode !== 'preview') {
    store.set(state.form.isDocumentRequired, true);
  }
};
