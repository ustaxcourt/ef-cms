import { state } from '@web-client/presenter/app.cerebral';

export const setDeletePrimaryIssueModalStateAction = ({
  props,
  store,
}: ActionProps<{ docketNumber: string }>) => {
  const { docketNumber } = props;

  store.set(state.modal.docketNumber, docketNumber);
};
