import { state } from 'cerebral';

/**
 * sets the document as required when saving AND serving a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props cerebral props
 * @param {object} providers.store the cerebral store used for setting the state
 */
export const setDocumentIsRequiredAction = ({ get, props, store }) => {
  const { isFileAttached } = get(state.form);
  const { isSavingForLater } = props;

  if (!isFileAttached && !isSavingForLater) {
    store.set(state.form.isDocumentRequired, true);
  }
};
