import { state } from '@web-client/presenter/app.cerebral';

/**
 * Set docket number as prop. To allow for routing.
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the docketNumber prop
 */
export const setDocketNumberPropAction = ({ get }: ActionProps) => {
  const { docketNumber } = get(state.caseDetail);
  return { docketNumber };
};
