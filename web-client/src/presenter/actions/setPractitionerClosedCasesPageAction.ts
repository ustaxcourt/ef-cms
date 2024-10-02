import { state } from '@web-client/presenter/app.cerebral';

export const setPractitionerClosedCasesPageAction = ({
  get,
  props,
  store,
}: ActionProps<{
  pageNumber: number;
}>) => {
  const { pageNumber } = props;
  const closedCaseInfo = get(state.practitionerDetail.openCaseInfo);

  if (!closedCaseInfo) {
    throw new Error(
      'Attempting to set state.practitionerDetail.closedCaseInfo.currentPage without first setting up state.practitionerDetail.closedCaseInfo',
    );
  }
  store.set(state.practitionerDetail.closedCaseInfo!.currentPage, pageNumber);
};
