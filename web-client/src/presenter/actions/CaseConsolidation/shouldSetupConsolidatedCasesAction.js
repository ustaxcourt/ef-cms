import { state } from 'cerebral';

/**
 * //fix
 * initialize consolidated case state values for ConfirmInitiateServiceModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 */
export const shouldSetupConsolidatedCasesAction = ({
  applicationContext,
  get,
}) => {
  const { eventCode } = get(state.form);
  const { SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES } =
    applicationContext.getConstants();

  if (!SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES.includes(eventCode)) {
    //implement
  }
};
