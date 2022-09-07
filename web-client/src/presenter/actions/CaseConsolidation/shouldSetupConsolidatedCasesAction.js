import { state } from 'cerebral';

/**
 * initialize consolidated case state values for ConfirmInitiateServiceModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.path the cerebral path object
 * @returns {object} the next path based on if the event code can be multi-docketed
 */
export const shouldSetupConsolidatedCasesAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { eventCode } = get(state.form);
  const { SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES } =
    applicationContext.getConstants();

  if (SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES.includes(eventCode)) {
    return path.no();
  } else {
    return path.yes();
  }
};
