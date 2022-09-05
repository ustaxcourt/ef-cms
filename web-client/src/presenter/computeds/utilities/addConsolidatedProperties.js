// eslint-disable-next-line spellcheck/spell-checker
/**
 * Adds consolidated case properties to the passed in object.
 *
 * @param {object} caseObject - caseObject to have consolidated case properties added into.
 * @returns {object} caseObject, consolidatedIconTooltipText, inConsolidatedGroup, and inLeadCase
 */

export const addConsolidatedProperties = caseObject => {
  let consolidatedIconTooltipText = null;
  const inConsolidatedGroup = !!caseObject.leadDocketNumber;
  const inLeadCase =
    inConsolidatedGroup &&
    caseObject.leadDocketNumber === caseObject.docketNumber;

  if (inConsolidatedGroup) {
    if (inLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }
  return {
    ...caseObject,
    consolidatedIconTooltipText,
    inConsolidatedGroup,
    inLeadCase,
  };
};
