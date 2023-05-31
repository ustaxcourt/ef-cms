import { state } from 'cerebral';

/**
 * checks if we are trying to save an unservable docket entry and returns different paths if so
 * @param {object} applicationContext the applicationContext
 * @param {Function} path cerebral path function
 * @param {Function} get the cerebral state getter function
 * @returns {Function} the path to take for the sequence
 */
export const shouldSaveToConsolidatedGroupAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);
  const { eventCode } = get(state.form);

  const isUnservable = UNSERVABLE_EVENT_CODES.includes(eventCode);
  const isLeadCase = applicationContext.getUtilities().isLeadCase(caseDetail);
  const isNotTaxCourtPamphlet = eventCode !== 'TCRP';

  if (isLeadCase && isUnservable && isNotTaxCourtPamphlet) {
    return path.yes();
  } else {
    return path.no();
  }
};
