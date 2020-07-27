import { state } from 'cerebral';

/**
 * FIXME
 * sets the props.caseId and props.docketNumber from the case in the state,
 * to be passed to subsequent actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} caseId
 */
export const setModalFormValuesAsPropsAction = ({
  applicationContext,
  get,
}) => {
  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();
  const documentType = get(state.modal.documentType);
  const documentTitle =
    get(state.modal.documentTitle) ||
    COURT_ISSUED_EVENT_CODES.find(ec => ec.eventCode === state.modal.eventCode)
      .documentTitle;

  const docketNumber = get(state.caseDetail.docketNumber);

  return { docketNumber, documentTitle, documentType };
};
