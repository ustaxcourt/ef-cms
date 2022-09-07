exports.setConsolidationFlagsForDisplay = caseItem => {
  caseItem.inConsolidatedGroup = caseItem.leadCase = false;

  if (caseItem.leadDocketNumber) {
    caseItem.inConsolidatedGroup = true;
    caseItem.consolidatedIconTooltipText = 'Consolidated case';
    if (caseItem.leadDocketNumber === caseItem.docketNumber) {
      caseItem.leadCase = true;
      caseItem.consolidatedIconTooltipText = 'Lead case';
    }
  }

  return caseItem;
};
