import { state } from '@web-client/presenter/app.cerebral';

/**
 * update props from modal state to pass to other actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const fetchUpdatedCasePrimaryIssueFromModalStateAction = ({
  get,
}: ActionProps) => {
  return {
    docketNumber: get(state.modal.docketNumber),
    primaryIssue: get(state.modal.notes),
  };
};
