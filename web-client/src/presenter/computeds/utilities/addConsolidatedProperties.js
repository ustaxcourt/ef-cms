// eslint-disable-next-line spellcheck/spell-checker
/**
 * Adds consolidated case properties to the passed in object.
 *
 * @param {object} object - Object to have consolidated case properties added into.
 * @returns {object} Object, consolidatedIconTooltipText, inConsolidatedGroup, and inLeadCase
 */

export const addConsolidatedProperties = object => {
  let consolidatedIconTooltipText = null;
  const inConsolidatedGroup = !!object.leadDocketNumber;
  const inLeadCase =
    inConsolidatedGroup && object.leadDocketNumber === object.docketNumber;

  if (inConsolidatedGroup) {
    if (inLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }
  return {
    ...object,
    consolidatedIconTooltipText,
    inConsolidatedGroup,
    inLeadCase,
  };
};
