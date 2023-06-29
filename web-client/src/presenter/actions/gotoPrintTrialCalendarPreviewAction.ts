import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.page which shows the docket record print preview (default, optional) and/or opens the document in a new tab (optional)
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store used for setting the state.pdfPreviewUrl
 */
export const gotoPrintTrialCalendarPreviewAction = ({
  get,
  props,
  router,
  store,
}: ActionProps) => {
  const { openNewTab = false, openNewView = true } = props;

  if (openNewView) {
    store.set(state.currentPage, 'PrintableTrialCalendar');
  }

  if (openNewTab) {
    const pdfPreviewUrl = get(state.pdfPreviewUrl);
    router.openInNewTab(pdfPreviewUrl);
  }
};
