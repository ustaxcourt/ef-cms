import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const allowExternalConsolidatedGroupFilingHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): boolean => {
  const { ALLOWLIST_FEATURE_FLAGS, USER_ROLES } =
    applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);
  const { eventCode: documentToFileEventCode } = get(state.form);
  const { isDirectlyAssociated: isRequestingAccess } = get(
    state.screenMetadata,
  );

  const isConsolidatedGroupAccessEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key
    ],
  );
  const isInConsolidatedGroup = !!caseDetail.leadDocketNumber;
  const isMultiDocketableEventCode = !!applicationContext
    .getConstants()
    .MULTI_DOCKET_FILING_EVENT_CODES.includes(documentToFileEventCode);
  const isIrsPractitionerRequestingAccess =
    isRequestingAccess &&
    applicationContext.getCurrentUser().role === USER_ROLES.irsPractitioner;

  let allowExternalConsolidatedGroupFiling = false;

  if (
    isConsolidatedGroupAccessEnabled &&
    isInConsolidatedGroup &&
    (isMultiDocketableEventCode || isIrsPractitionerRequestingAccess)
  ) {
    allowExternalConsolidatedGroupFiling = true;
  }

  return allowExternalConsolidatedGroupFiling;
};
