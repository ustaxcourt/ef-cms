import { state } from '@web-client/presenter/app.cerebral';

export const gotoPrintPublicSessionCopyPreviewAction = ({
  get,
  props,
  router,
  store,
}: ActionProps<{
  openNewTab?: boolean;
  openNewView?: boolean;
}>) => {
  const { openNewTab = false, openNewView = true } = props;

  if (openNewView) {
    store.set(state.printablePreview, 'publicSessionCopy');
    store.set(state.currentPage, 'PrintableTrialCalendar');
  }

  if (openNewTab) {
    const pdfPreviewUrl = get(state.pdfPreviewUrl);
    router.openInNewTab(pdfPreviewUrl);
  }
};
