const { isLeadCase } = require('../entities/cases/Case');

exports.setConsolidationFlagsForDisplay = caseItem => {
  caseItem.inConsolidatedGroup = caseItem.leadCase = false;

  if (caseItem.leadDocketNumber) {
    caseItem.inConsolidatedGroup = true;
    caseItem.consolidatedIconTooltipText = 'Consolidated case';

    if (isLeadCase(caseItem)) {
      caseItem.leadCase = true;
      caseItem.consolidatedIconTooltipText = 'Lead case';
    }
  }

  return caseItem;
};
