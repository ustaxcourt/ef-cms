const { isLeadCase } = require('../entities/cases/Case');

exports.setConsolidationFlagsForDisplay = (
  caseItem,
  eligibleCasesInGroup = [],
) => {
  const newCaseItem = { ...caseItem };

  newCaseItem.inConsolidatedGroup = newCaseItem.isLeadCase = false;

  if (newCaseItem.leadDocketNumber) {
    newCaseItem.inConsolidatedGroup = true;
    newCaseItem.consolidatedIconTooltipText = 'Consolidated case';

    if (isLeadCase(newCaseItem)) {
      newCaseItem.isLeadCase = true;
      newCaseItem.consolidatedIconTooltipText = 'Lead case';
    } else {
      const leadCase = eligibleCasesInGroup.find(
        theCase => theCase.docketNumber === newCaseItem.leadDocketNumber,
      );

      if (leadCase) {
        newCaseItem.shouldIndent = true;
      } else {
        delete newCaseItem.shouldIndent;
      }
    }
  }

  return newCaseItem;
};
