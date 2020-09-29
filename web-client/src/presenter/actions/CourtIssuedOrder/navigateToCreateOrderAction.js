import { state } from 'cerebral';
import queryString from 'query-string';

/**
 *
 * changes the route to view the create order page for the state.caseDetail.docketNumber, state.modal).docketEntryId, state.modal).documentType, state.modal).documentTitle and state.modal.parentMessageId
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToCreateOrderAction = async ({ get, router }) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const {
    docketEntryId,
    documentTitle,
    documentType,
    eventCode,
    parentMessageId,
  } = get(state.modal);

  let urlString;
  if (parentMessageId) {
    urlString = `/case-detail/${docketNumber}/create-order/${parentMessageId}`;
  } else {
    urlString = `/case-detail/${docketNumber}/create-order`;
  }

  const url = queryString.stringifyUrl({
    query: { docketEntryId, documentTitle, documentType, eventCode },
    url: urlString,
  });

  await router.openInNewTab(url);
};
