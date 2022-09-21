exports.setConsolidationFlagsForDisplay = (caseItem, eligibleCases) => {
  caseItem.inConsolidatedGroup = caseItem.leadCase = false;

  if (
    !eligibleCases ||
    (caseItem.leadDocketNumber &&
      eligibleCases.find(
        theCase => theCase.docketNumber === caseItem.leadDocketNumber,
      ))
  ) {
    if (caseItem.leadDocketNumber) {
      caseItem.inConsolidatedGroup = true;
      caseItem.consolidatedIconTooltipText = 'Consolidated case';
      if (caseItem.leadDocketNumber === caseItem.docketNumber) {
        caseItem.leadCase = true;
        caseItem.consolidatedIconTooltipText = 'Lead case';
      } else {
        const leadCase = eligibleCases.find(
          theCase => theCase.docketNumber === caseItem.leadDocketNumber,
        );

        if (
          !leadCase.highPriority &&
          !leadCase.isManuallyAdded &&
          !leadCase.isDocketSuffixHighPriority
        ) {
          caseItem.shouldIndent = true;
        }
      }
    }
  }

  return caseItem;
};
