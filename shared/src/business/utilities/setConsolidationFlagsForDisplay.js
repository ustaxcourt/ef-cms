exports.setConsolidationFlagsForDisplay = (
  caseItem,
  theCases = [],
  skipPriorityStatus = false,
) => {
  const newCaseItem = { ...caseItem };

  newCaseItem.inConsolidatedGroup = newCaseItem.leadCase = false;

  if (newCaseItem.leadDocketNumber) {
    newCaseItem.inConsolidatedGroup = true;
    newCaseItem.consolidatedIconTooltipText = 'Consolidated case';
    if (newCaseItem.leadDocketNumber === newCaseItem.docketNumber) {
      newCaseItem.leadCase = true;
      newCaseItem.consolidatedIconTooltipText = 'Lead case';
    } else {
      const leadCase = theCases.find(
        theCase => theCase.docketNumber === newCaseItem.leadDocketNumber,
      );

      if (
        !!leadCase &&
        (skipPriorityStatus ||
          (!leadCase.highPriority &&
            !leadCase.isManuallyAdded &&
            !leadCase.isDocketSuffixHighPriority &&
            !newCaseItem.highPriority &&
            !newCaseItem.isManuallyAdded &&
            !newCaseItem.isDocketSuffixHighPriority))
      ) {
        newCaseItem.shouldIndent = true;
      }
    }
  }

  return newCaseItem;
};
