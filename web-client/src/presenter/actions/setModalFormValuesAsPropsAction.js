import { state } from 'cerebral';

/**
 * sets props.docketNumber, props.documentTitle and props.documentType from the modal form values in state
 * to be passed to subsequent actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} docketNumber, documentTitle, documentType
 */
export const setModalFormValuesAsPropsAction = ({ get }) => {
  const documentType = get(state.modal.documentType);
  const documentTitle = get(state.modal.documentTitle);
  const docketNumber = get(state.caseDetail.docketNumber);

  return { docketNumber, documentTitle, documentType };
};
