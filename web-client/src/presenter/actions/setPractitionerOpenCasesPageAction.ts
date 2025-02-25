import { state } from '@web-client/presenter/app.cerebral';

export const setPractitionerOpenCasesPageAction = ({
  get,
  props,
  store,
}: ActionProps<{
  pageNumber: number;
}>) => {
  const { pageNumber } = props;
  const openCaseInfo = get(state.practitionerDetail.openCaseInfo);

  if (!openCaseInfo) {
    throw new Error(
      'Attempting to set state.practitionerDetail.openCaseInfo.currentPage without first setting up state.practitionerDetail.openCaseInfo',
    );
  }
  store.set(state.practitionerDetail.openCaseInfo!.currentPage, pageNumber);
};
