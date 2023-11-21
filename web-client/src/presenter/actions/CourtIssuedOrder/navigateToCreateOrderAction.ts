import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

/**
 *
 *changes the route to view the create order page for the state.caseDetail.docketNumber, state.modal).docketEntryId, state.modal).documentType, state.modal).documentTitle and state.modal.parentMessageId
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToCreateOrderAction = async ({
  get,
  router,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const {
    docketEntryId,
    documentTitle,
    documentType,
    eventCode,
    parentMessageId,
  } = get(state.modal);

  const queryString = qs.stringify({
    docketEntryId,
    documentTitle,
    documentType,
    eventCode,
  });

  let urlString;
  if (parentMessageId) {
    urlString = `/case-detail/${docketNumber}/create-order/${parentMessageId}`;
  } else {
    urlString = `/case-detail/${docketNumber}/create-order`;
  }

  if (window.localStorage?.getItem('__cypressOrderInSameTab')) {
    await router.route(`${urlString}?${queryString}`);
  } else {
    await router.openInNewTab(`${urlString}?${queryString}`);
  }
};
