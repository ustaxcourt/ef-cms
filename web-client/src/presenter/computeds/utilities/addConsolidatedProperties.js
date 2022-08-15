/**
 * This can add consolidatedToolTip, inConsolidatedGroup flag and/or inLeadCase flag to passed in object item.
 *
 * @param object
 * @returns object
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
