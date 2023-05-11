import { isLeadCase } from '../entities/cases/Case';

export const setConsolidationFlagsForDisplay = (caseItem, theCases = []) => {
  const newCaseItem = { ...caseItem };

  newCaseItem.inConsolidatedGroup = newCaseItem.isLeadCase = false;

  if (newCaseItem.leadDocketNumber) {
    newCaseItem.inConsolidatedGroup = true;
    newCaseItem.consolidatedIconTooltipText = 'Consolidated case';

    if (isLeadCase(caseItem)) {
      newCaseItem.isLeadCase = true;
      newCaseItem.consolidatedIconTooltipText = 'Lead case';
    } else {
      const leadCase = theCases.find(
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
