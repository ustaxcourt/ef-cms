import { state } from 'cerebral';

/**
 * determines the path to be taken based on form data
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {object} providers.path the cerebral path object
 * @returns {object} the next path based on if the event code can be multi-docketed
 */
export const shouldSetupConsolidatedCasesAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { eventCode } = get(state.form);
  const { SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES } =
    applicationContext.getConstants();

  if (SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES.includes(eventCode)) {
    store.set(state.showConsolidatedCaseCheckboxes, false);
    return path.no();
  }

  store.set(state.showConsolidatedCaseCheckboxes, true);
  return path.yes();
};
