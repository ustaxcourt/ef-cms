// eslint-disable-next-line spellcheck/spell-checker
/**
 * Adds consolidated case properties to the passed in object.
 * @param {object} caseObject - caseObject to have consolidated case properties added into.
 * @param {object} applicationContext - applicationContext the application context
 * @returns {object} caseObject, consolidatedIconTooltipText, inConsolidatedGroup, and inLeadCase
 */

export const addConsolidatedProperties = ({
  applicationContext,
  consolidatedObject,
}) => {
  let consolidatedIconTooltipText: string | null = null;
  const isLeadCase = applicationContext
    .getUtilities()
    .isLeadCase(consolidatedObject);

  const inConsolidatedGroup = !!consolidatedObject.leadDocketNumber;

  if (inConsolidatedGroup) {
    if (isLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }
  return {
    ...consolidatedObject,
    consolidatedIconTooltipText,
    inConsolidatedGroup,
    inLeadCase: isLeadCase,
  };
};
