import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears statistics on the confirmationText object from state.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearConfirmationTextStatisticsAction = ({
  store,
}: ActionProps) => {
  store.set(state.confirmationText.statistics, {});
};
