import { state } from '@web-client/presenter/app.cerebral';

/**
 * update props from state to pass to other sequence actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsForCanConsolidateAction = ({ get }: ActionProps) => {
  const confirmSelection = !!get(state.modal.confirmSelection);
  const caseToConsolidate = get(state.modal.caseDetail);
  const caseDetail = get(state.caseDetail);

  return { caseDetail, caseToConsolidate, confirmSelection };
};
