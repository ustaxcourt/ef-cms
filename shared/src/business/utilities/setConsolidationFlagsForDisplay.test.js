import { setConsolidationFlagsForDisplay } from './setConsolidationFlagsForDisplay';

describe('setConsolidationFlagsForDisplay', () => {
  it('should set inConsolidatedGroup and leadCase to false if leadDocketNumber is undefined', () => {
    const mockCaseItem = {
      docketNumber: '101-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: undefined,
      inConsolidatedGroup: false,
      leadCase: false,
    });
  });

  it('correctly flags a consolidated (but not lead) case and sets consolidatedIconTooltipText', () => {
    const mockCaseItem = {
      docketNumber: '101-20',
      leadDocketNumber: '202-12',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      leadCase: false,
    });
  });

  it('correctly flags a lead case and sets consolidatedIconTooltipText', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '303-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Lead case',
      inConsolidatedGroup: true,
      leadCase: true,
    });
  });
});
