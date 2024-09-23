import { state } from '@web-client/presenter/app.cerebral';

export const setPractitionerOpenCasesPageAction = ({
  props,
  store,
}: ActionProps<{
  pageNumber: number;
}>) => {
  const { pageNumber } = props;
  console.log(pageNumber);
  store.set(state.practitionerDetail.openCasesPageNumber, pageNumber);
};
