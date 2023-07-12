import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets archive draft document state properties (docketEntryId, docketNumber, and documentTitle)
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props incoming cerebral props
 */
export const setArchiveDraftDocumentAction = ({
  props,
  store,
}: ActionProps) => {
  const { docketEntryId, docketNumber, documentTitle } = props;

  store.set(state.archiveDraftDocument, {
    docketEntryId,
    docketNumber,
    documentTitle,
  });
};
