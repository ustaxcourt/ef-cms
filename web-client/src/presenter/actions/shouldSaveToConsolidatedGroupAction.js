import { state } from 'cerebral';

export const isUnservableDocketEntryOnLeadCase = ({
  applicationContext,
  get,
}) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();
  const isUnservable = UNSERVABLE_EVENT_CODES.includes(form.eventCode);
  const isLeadCase = docketNumber === leadDocketNumber;
  const { docketNumber, leadDocketNumber } = caseDetail;
  return isLeadCase && isUnservable;
};

// TODO: CS JS DOCS
/**
 * changes the path based on if the case is a lead case and docket entry being saved is unservable
 *
 * @param {string } showModal the value to set the modal to
 * @returns {Function} the primed action
 */
// TODO: CS DRY UP THIS CODE WITH THE shouldOpenInitiateSaveModalAction
export const shouldSaveToConsolidatedGroupAction = ({
  applicationContext,
  get,
  path,
}) => {
  if (isUnservableDocketEntryOnLeadCase({ applicationContext, get })) {
    return path.yes();
  } else {
    return path.no();
  }
};
