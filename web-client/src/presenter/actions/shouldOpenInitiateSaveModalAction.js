import { isUnservableDocketEntryOnLeadCase } from './shouldSaveToConsolidatedGroupAction';

/**
 * changes the path based on if the case is a lead case and docket entry being saved is unservable
 *
 * @param {object} applicationContext the applicationContext
 * @param {Function} path cerebral path function
 * @param {Function} get the cerebral state getter function
 * @returns {Function} the path to take for the sequence
 */
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
