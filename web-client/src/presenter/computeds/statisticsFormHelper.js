import { state } from 'cerebral';

/**
 * gets the statistics form helper fields
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} partyTypes constant, showPrimary/SecondaryContact,
 * showOwnershipDisclosureStatement, and ownershipDisclosureStatementDocumentId
 */
export const statisticsFormHelper = (get, applicationContext) => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const caseDetail = get(state.form);

  const showStatisticsForm =
    caseDetail.caseType === CASE_TYPES_MAP.deficiency &&
    caseDetail.hasVerifiedIrsNotice;

  return {
    showStatisticsForm,
  };
};
