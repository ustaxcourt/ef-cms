import { state } from '@web-client/presenter/app.cerebral';

export const setPractitionerClosedCasesPageAction = ({
  props,
  store,
}: ActionProps<{
  pageNumber: number;
}>) => {
  const { pageNumber } = props;
  store.set(state.practitionerDetail.closedCaseInfo?.currentPage, pageNumber);
};
