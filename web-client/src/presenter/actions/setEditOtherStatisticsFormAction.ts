import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form using the damages and litigationCosts from the caseDetail
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setEditOtherStatisticsFormAction = ({
  get,
  store,
}: ActionProps) => {
  const { damages, litigationCosts } = get(state.caseDetail);

  store.set(state.form, {
    damages,
    isEditing: true,
    litigationCosts,
  });
};
