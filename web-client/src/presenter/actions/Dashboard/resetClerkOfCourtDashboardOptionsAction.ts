import { state } from '@web-client/presenter/app.cerebral';

export const resetClerkOfCourtDashboardOptionsAction = ({
  store,
}: ActionProps) => {
  store.set(state.clerkOfCourtDashboardOptions.casesByYearIsFiscal, false);
  store.set(state.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal, false);
};
