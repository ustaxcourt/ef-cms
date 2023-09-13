import { isLeadCase as isLeadCaseImport } from '../entities/cases/Case';

export const setConsolidationFlagsForDisplay = <T>(
  caseItem: { docketNumber: string; leadDocketNumber?: string } & T,
  theCases: { docketNumber: string }[] = [],
): T & {
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText: string;
  shouldIndent: boolean;
  isLeadCase: boolean;
} => {
  let isLeadCase = false;
  let inConsolidatedGroup = false;
  let shouldIndent = false;
  let consolidatedIconTooltipText = '';

  if (caseItem.leadDocketNumber) {
    inConsolidatedGroup = true;
    consolidatedIconTooltipText = 'Consolidated case';
    if (isLeadCaseImport(caseItem)) {
      isLeadCase = true;
      consolidatedIconTooltipText = 'Lead case';
    } else {
      const leadCase = theCases.find(
        theCase => theCase.docketNumber === caseItem.leadDocketNumber,
      );

      if (leadCase) {
        shouldIndent = true;
      } else {
        shouldIndent = false;
      }
    }
  }

  return {
    ...caseItem,
    consolidatedIconTooltipText,
    inConsolidatedGroup,
    isLeadCase,
    shouldIndent,
  };
};
