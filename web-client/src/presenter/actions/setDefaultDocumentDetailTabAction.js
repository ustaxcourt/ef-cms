import { state } from 'cerebral';

/**
 * sets the state.currentTab based on the state.documentDetailHelper
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.currentTab
 * @param {Function} providers.get the cerebral get function used for getting state.documentDetailHelper
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
    [
      STATUS_TYPES.new,
      STATUS_TYPES.recalled,
      STATUS_TYPES.batchedForIRS,
    ].includes(caseDetail.status);

  store.set(
    state.currentTab,
    showDocumentInfoTab ? 'Document Info' : 'Messages',
  );
  store.unset(state.documentDetail.messagesTab);
};
