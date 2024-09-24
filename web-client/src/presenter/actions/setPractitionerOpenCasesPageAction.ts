import { state } from '@web-client/presenter/app.cerebral';

export const setPractitionerOpenCasesPageAction = ({
  props,
  store,
}: ActionProps<{
  pageNumber: number;
}>) => {
  const { pageNumber } = props;
  store.set(state.practitionerDetail.openCaseInfo.currentPage, pageNumber);
};
