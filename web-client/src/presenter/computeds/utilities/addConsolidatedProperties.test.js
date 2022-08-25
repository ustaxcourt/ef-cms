import { addConsolidatedProperties } from './addConsolidatedProperties';

describe('addConsolidatedProperties', () => {
  it('should add the Lead case tooltip text and set both inConsolidatedGroup and isLeadCase to true when docket number and leadDocketNumber are the same', () => {
    const result = addConsolidatedProperties({
      docketNumber: '101-20',
      leadDocketNumber: '101-20',
    });
    expect(result).toMatchObject({
      consolidatedIconTooltipText: 'Lead case',
      inConsolidatedGroup: true,
      inLeadCase: true,
    });
  });

  it('should add the Consolidated case tooltip text and set inConsolidatedGroup to true and isLeadCase to false when docket number and leadDocketNumber are not the same but in the same consolidated group', () => {
    const result = addConsolidatedProperties({
      docketNumber: '101-21',
      leadDocketNumber: '101-20',
    });
    expect(result).toMatchObject({
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      inLeadCase: false,
    });
  });

  it('should not add a tool tip and set both inConsolidatedGroup and inLeadCase to false when the docket nuimber is not part of a consolidated group', () => {
    const result = addConsolidatedProperties({
      docketNumber: '101-21',
      leadDocketNumber: undefined,
    });
    expect(result).toMatchObject({
      consolidatedIconTooltipText: null,
      inConsolidatedGroup: false,
      inLeadCase: false,
    });
  });
});
