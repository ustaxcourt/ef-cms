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

  it('should not indent the case item if the lead case is high priority', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '300-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem, [
      {
        docketNumber: '300-20',
        highPriority: true,
      },
    ]);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      leadCase: false,
      shouldIndent: undefined,
    });
  });

  it('should not indent the case item if the lead case is manually added', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '300-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem, [
      {
        docketNumber: '300-20',
        isManuallyAdded: true,
      },
    ]);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      leadCase: false,
      shouldIndent: undefined,
    });
  });

  it('should not indent the case item if the lead case has isDocketSuffixHighPriority', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      leadDocketNumber: '300-20',
    };
    const result = setConsolidationFlagsForDisplay(mockCaseItem, [
      {
        docketNumber: '300-20',
        isDocketSuffixHighPriority: true,
      },
    ]);

    expect(result).toEqual({
      ...mockCaseItem,
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      leadCase: false,
      shouldIndent: undefined,
    });
  });

  it('should not indent the case item if the caseItem has highPriority', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      highPriority: true,
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
      leadCase: false,
      shouldIndent: undefined,
    });
  });

  it('should not indent the case item if the caseItem has manuallyAdded', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      isManuallyAdded: true,
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
      leadCase: false,
      shouldIndent: undefined,
    });
  });

  it('should not indent the case item if the caseItem has isDocketSuffixHighPriority', () => {
    const mockCaseItem = {
      docketNumber: '303-20',
      isDocketSuffixHighPriority: true,
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
      leadCase: false,
      shouldIndent: undefined,
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
      leadCase: false,
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
      leadCase: false,
      shouldIndent: undefined,
    });
  });
});
