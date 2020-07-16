import { state } from 'cerebral';

/**
 * Set url to redirect to from state.nextPage
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setRedirectUrlFromNextPageAction = async ({
  get,
  props,
  store,
}) => {
  const nextPageUrl = props.nextPage;
  const docketNumber = get(state.caseDetail.docketNumber);

  if (nextPageUrl) {
    let redirectUrl;

    switch (nextPageUrl) {
      case 'MessageDetail': {
        const parentMessageId = get(state.parentMessageId);
        redirectUrl = `/case-messages/${docketNumber}/message-detail/${parentMessageId}`;
        break;
      }
      case 'CaseDetailInternal': {
        const documentId = get(state.documentId);
        redirectUrl = `/case-detail/${docketNumber}/document-view?documentId=${documentId}`;
        break;
      }
      case 'DocumentQC':
      default:
        redirectUrl = '/document-qc/my/inbox';
    }

    store.set('redirectUrl', redirectUrl);
  }
};
