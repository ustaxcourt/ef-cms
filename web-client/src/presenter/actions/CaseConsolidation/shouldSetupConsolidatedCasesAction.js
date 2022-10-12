import { state } from 'cerebral';

/**
 * determines the path to be taken based on helper property
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.path the cerebral path object
 * @returns {object} the next path based on if consolidated cases should be set up
 */
export const shouldSetupConsolidatedCasesAction = ({
  applicationContext,
  get,
  path,
}) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const {
    ENTERED_AND_SERVED_EVENT_CODES,
    SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
  } = applicationContext.getConstants();

  const eventCodesNotCompatibleWithConsolidation = [
    ...ENTERED_AND_SERVED_EVENT_CODES,
    ...SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
  ];

  let { eventCode } = get(state.form);

  if (!eventCode) {
    ({ eventCode } = caseDetail.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    ));
  }

  const shouldNotSetupConsolidatedCases =
    eventCodesNotCompatibleWithConsolidation.includes(eventCode);

  if (shouldNotSetupConsolidatedCases) {
    return path.no();
  }

  return path.yes();
};
