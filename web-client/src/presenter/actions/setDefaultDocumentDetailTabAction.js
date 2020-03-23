import { state } from 'cerebral';

/**
 * sets the state.currentViewMetadata.tab based on the state.documentDetailHelper
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDefaultDocumentDetailTabAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { STATUS_TYPES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const document = caseDetail.documents.find(
    item => item.documentId === documentId,
  );

  const showDocumentInfoTab =
    document.documentType === 'Petition' &&
    [STATUS_TYPES.new, STATUS_TYPES.inProgress].includes(caseDetail.status);

  store.set(
    state.currentViewMetadata.tab,
    showDocumentInfoTab ? 'Document Info' : 'Messages',
  );
  store.unset(state.documentDetail.messagesTab);
};
