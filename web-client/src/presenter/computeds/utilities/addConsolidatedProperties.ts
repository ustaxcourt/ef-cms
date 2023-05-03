// eslint-disable-next-line spellcheck/spell-checker
/**
 * Adds consolidated case properties to the passed in object.
 *
 * @param {object} caseObject - caseObject to have consolidated case properties added into.
 * @param {object} applicationContext - applicationContext the application context
 * @returns {object} caseObject, consolidatedIconTooltipText, inConsolidatedGroup, and inLeadCase
 */

export const addConsolidatedProperties = ({
  applicationContext,
  caseObject,
}) => {
  let consolidatedIconTooltipText: string | null = null;
  const isLeadCase = applicationContext.getUtilities().isLeadCase(caseObject);

  const inConsolidatedGroup = !!caseObject.leadDocketNumber;

  if (inConsolidatedGroup) {
    if (isLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }
  return {
    ...caseObject,
    consolidatedIconTooltipText,
    inConsolidatedGroup,
    inLeadCase: isLeadCase,
  };
};
