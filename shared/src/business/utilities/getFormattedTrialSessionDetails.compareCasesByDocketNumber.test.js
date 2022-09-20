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
        docketNumber: '104-22',
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '103-22',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '103-22',
        leadDocketNumber: '104-22',
      },
      {
        docketNumber: '106-22',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '106-22',
        leadDocketNumber: '104-22',
      },
      {
        docketNumber: '104-22',
        docketNumberSuffix: 'L',
        docketNumberWithSuffix: '104-22L',
        leadDocketNumber: '104-22',
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

  it('groups consolidated cases together for display when consolidated groups are out of order', () => {
    const eligibleCases = [
      {
        docketNumber: '104-22',
      },
    ];
    const formattedEligibleCases = [
      {
        docketNumber: '106-22',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '106-22',
        leadDocketNumber: '104-22',
      },
      {
        docketNumber: '104-22',
        docketNumberSuffix: 'L',
        docketNumberWithSuffix: '104-22L',
        leadDocketNumber: '104-22',
      },
      {
        docketNumber: '103-22',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '103-22',
        leadDocketNumber: '104-22',
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
});
