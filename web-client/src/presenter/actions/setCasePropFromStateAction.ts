import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the props.docketNumber from the case in the state,
 * to be passed to subsequent actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} docketNumber
 */
export const setCasePropFromStateAction = ({ get }: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  return { docketNumber };
};
