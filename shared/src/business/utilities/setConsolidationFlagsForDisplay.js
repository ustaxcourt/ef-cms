exports.setConsolidationFlagsForDisplay = (
  caseItem,
  eligibleCasesInGroup = [],
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
      const leadCase = eligibleCasesInGroup.find(
        theCase => theCase.docketNumber === newCaseItem.leadDocketNumber,
      );

      if (leadCase) {
        newCaseItem.shouldIndent = true;
      }
    }
  }

  return newCaseItem;
};
