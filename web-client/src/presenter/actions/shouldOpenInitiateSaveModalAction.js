import { isUnservableDocketEntryOnLeadCase } from './shouldSaveToConsolidatedGroupAction';

/**
 * changes the path based on if the case is a lead case and docket entry being saved is unservable
 *
 * @param {string } showModal the value to set the modal to
 * @returns {Function} the primed action
 */
// TODO: CS Test this action
export const shouldOpenInitiateSaveModalAction = ({
  applicationContext,
  get,
  path,
}) => {
  if (isUnservableDocketEntryOnLeadCase({ applicationContext, get })) {
    return path.openModal();
  } else {
    return path.submit();
  }
};
