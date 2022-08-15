import { addConsolidatedProperties } from './addConsolidatedProperties';

describe('addConsolidatedProperties', () => {
  it('should return the expected object when the message passed in is on the lead case & consolidated group', () => {
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

  it('should return the expected object when the message passed in is NOT on the lead case & consolidated group', () => {
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

  it('should return the expected object when the message passed in is not part of a consolidated group', () => {
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
