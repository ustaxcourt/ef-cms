import { state } from 'cerebral';

/**
 * Sets value for isExternalConsolidatedCaseGroupEnabled
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
  const { overrideForRequestAccess } = props;

  const isConsolidatedGroupAccessEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key
    ],
  );
  const isInConsolidatedGroup = !!caseDetail.leadDocketNumber;
  const isMultiDocketableEventCode =
    overrideForRequestAccess ??
    !!applicationContext
      .getConstants()
      .MULTI_DOCKET_FILING_EVENT_CODES.includes(documentToFileEventCode);

  let allowExternalConsolidatedGroupFiling = false;
  if (
    isConsolidatedGroupAccessEnabled &&
    isInConsolidatedGroup &&
    isMultiDocketableEventCode
  ) {
    allowExternalConsolidatedGroupFiling = true;
  }
  store.set(
    state.allowExternalConsolidatedGroupFiling,
    allowExternalConsolidatedGroupFiling,
  );
};
