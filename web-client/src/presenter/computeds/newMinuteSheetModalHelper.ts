import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const newMinuteSheetModalHelper = (
  get: Get,
): {
  caseDetailLink: string | undefined;
  caseInfo: any;
  consolidatedCaseMessage: string | undefined;
  hasValidationError: boolean;
  isConsolidatedCase: boolean;
  minuteSheetDocketNumber: string | undefined;
  showCaseLink: boolean;
} => {
  const caseInfo = get(state.modal.caseInfo);
  const validationErrors = get(state.validationErrors);

  // Format the case link URL if case info exists
  const caseDetailLink = caseInfo?.docketNumber
    ? `/case-detail/${caseInfo.docketNumber}`
    : undefined;

  // Determine which docket number to use for minute sheet (lead case if consolidated)
  const minuteSheetDocketNumber =
    caseInfo?.leadDocketNumber || caseInfo?.docketNumber;

  // Format display text for consolidated cases
  const isConsolidatedCase =
    !!caseInfo?.leadDocketNumber &&
    caseInfo.leadDocketNumber !== caseInfo.docketNumber;
  const consolidatedCaseMessage = isConsolidatedCase
    ? `This is a consolidated case. The minute sheet will be created for the lead case ${caseInfo.leadDocketNumber}.`
    : undefined;

  return {
    caseDetailLink,
    caseInfo,
    consolidatedCaseMessage,
    hasValidationError: !!validationErrors?.docketNumber,
    isConsolidatedCase,
    minuteSheetDocketNumber,
    showCaseLink: !!caseInfo && !validationErrors?.docketNumber,
  };
};
