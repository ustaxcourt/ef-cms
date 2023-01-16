import { state } from 'cerebral';

/**
 * gets docket numbers of all checked consolidated cases for shared docket entry service
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the list of docketNumbers
 */
export const getDocketNumbersForConsolidatedServiceAction = ({
  applicationContext,
  get,
}) => {
  const { NON_MULTI_DOCKETABLE_EVENT_CODES } =
    applicationContext.getConstants();
  const { isLeadCase } = applicationContext.getUtilities();

  const caseDetail = get(state.caseDetail);
  const { eventCode } = get(state.form);

  const consolidatedCases = caseDetail.consolidatedCases || [];

  let docketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .filter(consolidatedCase => !isLeadCase(consolidatedCase))
    .map(consolidatedCase => consolidatedCase.docketNumber);

  if (
    !isLeadCase(caseDetail) ||
    NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode)
  ) {
    docketNumbers = [];
  }

  return { docketNumbers };
};
