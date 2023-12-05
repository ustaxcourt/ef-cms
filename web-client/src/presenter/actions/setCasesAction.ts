import { TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setCasesAction = ({
  props,
  store,
}: ActionProps<{
  openCaseList: TAssociatedCase[];
  closedCaseList: TAssociatedCase[];
}>) => {
  store.set(state.openCases, props.openCaseList);
  store.set(state.closedCases, props.closedCaseList);
};
