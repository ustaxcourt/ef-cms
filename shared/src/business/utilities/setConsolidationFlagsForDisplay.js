exports.setConsolidationFlagsForDisplay = (
  caseItem,
  theCases = [],
  skipPriorityStatus = false,
) => {
  caseItem.inConsolidatedGroup = caseItem.leadCase = false;

  if (caseItem.leadDocketNumber) {
    caseItem.inConsolidatedGroup = true;
    caseItem.consolidatedIconTooltipText = 'Consolidated case';
    if (caseItem.leadDocketNumber === caseItem.docketNumber) {
      caseItem.leadCase = true;
      caseItem.consolidatedIconTooltipText = 'Lead case';
    } else {
      const leadCase = theCases.find(
        theCase => theCase.docketNumber === caseItem.leadDocketNumber,
      );

      if (
        !!leadCase &&
        (skipPriorityStatus ||
          (!leadCase.highPriority &&
            !leadCase.isManuallyAdded &&
            !leadCase.isDocketSuffixHighPriority &&
            !caseItem.highPriority &&
            !caseItem.isManuallyAdded &&
            !caseItem.isDocketSuffixHighPriority))
      ) {
        caseItem.shouldIndent = true;
      }
    }
  }

  return caseItem;
};
