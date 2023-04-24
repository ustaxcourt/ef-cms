import { state } from 'cerebral';

/**
 * Sets value for isExternalConsolidatedCaseGroupEnabled
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setIsExternalConsolidatedCaseGroupEnabledValueAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const { eventCode: documentToFileEventCode } = get(state.form);
  const { overrideIsMultiDocketableEventCode } = props;

  const isConsolidatedGroupAccessEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key
    ],
  );
  const isInConsolidatedGroup = !!caseDetail.leadDocketNumber;
  const isMultiDocketableEventCode =
    overrideIsMultiDocketableEventCode ??
    !!applicationContext
      .getConstants()
      .MULTI_DOCKET_FILING_EVENT_CODES.includes(documentToFileEventCode);

  store.set(state.isExternalConsolidatedCaseGroupFilingEnabled, false);
  console.log(
    'isConsolidatedGroupAccessEnabled',
    isConsolidatedGroupAccessEnabled,
  );
  console.log('isInConsolidatedGroup', isInConsolidatedGroup);
  console.log('isMultiDocketableEventCode', isMultiDocketableEventCode);
  if (
    isConsolidatedGroupAccessEnabled &&
    isInConsolidatedGroup &&
    isMultiDocketableEventCode
  ) {
    store.set(state.isExternalConsolidatedCaseGroupFilingEnabled, true);
  }
};
