import { state } from '@web-client/presenter/app.cerebral';

export const deletePrimaryIssueAction = ({ store }: ActionProps) => {
  store.set(state.modal.primaryIssue, undefined);
};
