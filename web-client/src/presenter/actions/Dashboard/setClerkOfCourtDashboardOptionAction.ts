import { state } from '@web-client/presenter/app.cerebral';

export const setClerkOfCourtDashboardOptionAction = ({
  props,
  store,
}: ActionProps<{
  key: string;
  value: any;
}>) => {
  const { key, value } = props;
  store.set(state.clerkOfCourtDashboardOptions[key], value);
};
