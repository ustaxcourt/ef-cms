import { state } from 'cerebral';

/**
 * sets state.docketEntryId based on if editing or file is attached
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setDocketEntryIdAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { primaryDocumentFileId } = props;
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;
  const isEditingDocketEntry = get(state.isEditingDocketEntry);

  let docketEntryId;
  if (isEditingDocketEntry) {
    docketEntryId = get(state.docketEntryId);
  } else if (isFileAttached) {
    docketEntryId = primaryDocumentFileId;
  } else {
    docketEntryId = applicationContext.getUniqueId();
  }

  store.set(state.docketEntryId, docketEntryId);
};
