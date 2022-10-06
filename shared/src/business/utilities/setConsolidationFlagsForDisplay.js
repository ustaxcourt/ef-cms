const { isLeadCase } = require('../entities/cases/Case');

exports.setConsolidationFlagsForDisplay = (
  caseItem,
  eligibleCasesInGroup = [],
  skipPriorityStatus = false,
) => {
  const newCaseItem = { ...caseItem };
  newCaseItem.inConsolidatedGroup = newCaseItem.leadCase = false;

  if (newCaseItem.leadDocketNumber) {
    newCaseItem.inConsolidatedGroup = true;
    newCaseItem.consolidatedIconTooltipText = 'Consolidated case';

    if (isLeadCase(newCaseItem)) {
      newCaseItem.leadCase = true;
      newCaseItem.consolidatedIconTooltipText = 'Lead case';
    } else {
      const leadCase = eligibleCasesInGroup.find(
        theCase => theCase.docketNumber === newCaseItem.leadDocketNumber,
      );

      if (!!leadCase && !skipPriorityStatus) {
        newCaseItem.shouldIndent = true;
      }
    }
  }

  return newCaseItem;
};
