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

  const caseDetail = get(state.caseDetail);
  const { eventCode } = get(state.form);
  const consolidatedCases = caseDetail.consolidatedCases || [];

  const isLeadCase = applicationContext.getUtilities().isLeadCase(caseDetail);

  let docketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumber);

  if (
    !isLeadCase ||
    docketNumbers.length === 0 ||
    NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode)
  ) {
    docketNumbers = [caseDetail.docketNumber];
  }

  return { docketNumbers };
};
