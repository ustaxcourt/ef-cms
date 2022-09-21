import {
  compareTrialSessionEligibleCases,
  compareTrialSessionEligibleCasesGroupsFactory,
} from './getFormattedTrialSessionDetails';

describe('formattedTrialSessionDetails', () => {
  describe('comparing eligible cases', () => {
    it('prioritizes L and P', () => {
      const result = compareTrialSessionEligibleCases()(
        {
          docketNumber: '101-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '101-19',
          isDocketSuffixHighPriority: false,
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '101-19P',
          isDocketSuffixHighPriority: true,
        },
      );
      expect(result).toBe(1);
    });

    it('compares eligible trial session cases sorting lien/levy and passport first', () => {
      const formattedEligibleCases = [
        {
          docketNumber: '101-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '101-19',
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '101-19P',
          isDocketSuffixHighPriority: true,
        },
      ];
      const result = formattedEligibleCases.sort(
        compareTrialSessionEligibleCases(),
      );
      expect(result).toMatchObject([
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '101-19P',
          isDocketSuffixHighPriority: true,
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '101-19',
        },
      ]);
    });

    it('compares eligible trial session cases sorting manually added cases first', () => {
      const formattedEligibleCases = [
        {
          // should be last
          docketNumber: '105-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '105-19',
        },
        {
          // should be 3rd
          docketNumber: '101-19',
          docketNumberSuffix: 'L',
          docketNumberWithSuffix: '101-19L',
        },
        {
          // should be 1st
          docketNumber: '103-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '103-19P',
          isManuallyAdded: true,
        },
        {
          // should be 2nd
          docketNumber: '104-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '104-19',
          highPriority: true,
        },
      ];
      const result = formattedEligibleCases.sort(
        compareTrialSessionEligibleCases(),
      );
      expect(result).toMatchObject([
        {
          docketNumber: '103-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '103-19P',
          isManuallyAdded: true,
        },
        {
          docketNumber: '104-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '104-19',
          highPriority: true,
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'L',
          docketNumberWithSuffix: '101-19L',
        },
        {
          docketNumber: '105-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '105-19',
        },
      ]);
    });
  });

  it('groups consolidated cases together for display', () => {
    const eligibleCases = [
      {
        docketNumber: '103-22',
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '103-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '106-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '104-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '105-22',
      },
      {
        docketNumber: '107-22',
        highPriority: true,
      },
      {
        docketNumber: '108-22',
        isManuallyAdded: true,
      },
    ];
    const result = formattedEligibleCases.sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    );
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
    ]);
  });

  it('groups consolidated cases together for display when consolidated groups are out of order', () => {
    const eligibleCases = [
      {
        docketNumber: '103-22',
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '106-22',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '106-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '104-22',
        docketNumberSuffix: 'L',
        docketNumberWithSuffix: '104-22L',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '103-22',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '103-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '105-22',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '105-22P',
      },
      {
        docketNumber: '107-22',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '107-22P',
        highPriority: true,
      },
      {
        docketNumber: '108-22',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '108-22P',
        isManuallyAdded: true,
      },
    ];
    const result = formattedEligibleCases.sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    );

    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
    ]);
  });

  it('groups two separate consolidated cases correctly', () => {
    const eligibleCases = [
      {
        docketNumber: '103-22',
      },
      {
        docketNumber: '103-21',
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '105-21',
        isManuallyAdded: true,
        leadDocketNumber: '103-21',
      },
      {
        docketNumber: '106-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '104-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '103-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '103-21',
        leadDocketNumber: '103-21',
      },
      {
        docketNumber: '105-23',
      },
      {
        docketNumber: '107-22',
        highPriority: true,
      },
      {
        docketNumber: '108-22',
        isManuallyAdded: true,
      },
      {
        docketNumber: '104-21',
        leadDocketNumber: '103-21',
      },
    ];
    const result = formattedEligibleCases.sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    );
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '105-21',
      }),
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '103-21',
      }),
      expect.objectContaining({
        docketNumber: '104-21',
      }),
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '105-23',
      }),
    ]);
  });

  it('groups the cases correctly when the eligible lead case is not in the list', () => {
    const eligibleCases = [];
    const formattedEligibleCases = [
      {
        docketNumber: '106-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '104-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '105-22',
      },
      {
        docketNumber: '107-22',
        highPriority: true,
      },
      {
        docketNumber: '108-22',
        isManuallyAdded: true,
      },
    ];
    const result = formattedEligibleCases.sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    );
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case is high priority', () => {
    const eligibleCases = [
      {
        docketNumber: '103-22',
        highPriority: true,
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '103-22',
        highPriority: true,
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '104-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '106-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '105-22',
      },
    ];
    const result = formattedEligibleCases.sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    );
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case is manually added', () => {
    const eligibleCases = [
      {
        docketNumber: '103-22',
        isManuallyAdded: true,
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '103-22',
        isManuallyAdded: true,
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '104-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '106-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '105-22',
      },
    ];
    const result = formattedEligibleCases.sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    );
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case has high priority suffix', () => {
    const eligibleCases = [
      {
        docketNumber: '103-22',
        isDocketSuffixHighPriority: true,
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '103-22',
        isDocketSuffixHighPriority: true,
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '104-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '106-22',
        leadDocketNumber: '103-22',
      },
      {
        docketNumber: '105-22',
      },
    ];
    const result = formattedEligibleCases.sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    );
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });
});
