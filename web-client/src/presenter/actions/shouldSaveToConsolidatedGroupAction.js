import { state } from 'cerebral';

/**
 * checks if we are trying to save an unservable docket entry and returns different paths if so
 *
 * @param {object} applicationContext the applicationContext
 * @param {Function} path cerebral path function
 * @param {Function} get the cerebral state getter function
 * @returns {Function} the path to take for the sequence
 */
export const shouldSaveToConsolidatedGroupAction = ({
  applicationContext,
  get,
  path,
}) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();
  const isUnservable = UNSERVABLE_EVENT_CODES.includes(form.eventCode);
  const { docketNumber, leadDocketNumber } = caseDetail;
  const isLeadCase = docketNumber === leadDocketNumber;
  const takeYesPath = isLeadCase && isUnservable;

  if (takeYesPath) {
    return path.yes();
  } else {
    return path.no();
  }
};
