import { state } from 'cerebral';

/**
 * sets the state.page which shows the docket record print preview (default, optional) and/or opens the document in a new tab (optional)
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.router the riot.router object that is used for changing the route
 */
export const gotoPrintDocketRecordPreviewAction = async ({
  get,
  props,
  router,
}) => {
  const { openNewTab = false, openNewView = true } = props;

  if (openNewView) {
    await router.route(
      `/case-detail/${get(
        state.caseDetail.docketNumber,
      )}/printable-docket-record`,
    );
  }

  if (openNewTab) {
    const pdfPreviewUrl = get(state.pdfPreviewUrl);
    router.openInNewTab(pdfPreviewUrl);
  }
};
