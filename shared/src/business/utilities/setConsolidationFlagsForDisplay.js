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
        caseItem.shouldIndent = true;
      }
    }
  }

  return caseItem;
};
