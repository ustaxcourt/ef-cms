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
      isLeadCase: false,
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
      isLeadCase: false,
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
      isLeadCase: true,
    });
  });

  it('should not indent the case if group the case is part of does not contain lead case', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '300-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem, []);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      isLeadCase: false,
      shouldIndent: undefined,
    });
  });

  it('should indent the case item if the lead case is part of the same group', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '300-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem, [
      {
        docketNumber: '300-20',
      },
    ]);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      isLeadCase: false,
      shouldIndent: true,
    });
  });

  it('should indent the case item if the lead case has isManuallyAdded and skipPriorityStatus is true', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '300-20',
    };
    const result = setConsolidationFlagsForDisplay(
      mockCaseItem,
      [
        {
          docketNumber: '300-20',
          isManuallyAdded: true,
        },
      ],
      true,
    );

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      isLeadCase: false,
      shouldIndent: true,
    });
  });

  it('should NOT indent the case when the lead case is missing from the case list and skipPriorityStatus is true', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '300-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem, [], true);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      isLeadCase: false,
      shouldIndent: undefined,
    });
  });
});
