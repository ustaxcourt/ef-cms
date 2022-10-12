import { compareCasesByDocketNumber } from './getFormattedTrialSessionDetails';

describe('formattedTrialSessionDetails.compareCasesByDocketNumber', () => {
  it('101-19 should come before 102-19', () => {
    const result = compareCasesByDocketNumber(
      {
        docketNumber: '101-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '101-19',
        isDocketSuffixHighPriority: false,
      },
      {
        docketNumber: '102-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '102-19P',
        isDocketSuffixHighPriority: true,
      },
    );
    expect(result).toBe(-1);
  });

  it('102-19 should equal 102-19', () => {
    const result = compareCasesByDocketNumber(
      {
        docketNumber: '102-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '102-19',
        isDocketSuffixHighPriority: false,
      },
      {
        docketNumber: '102-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '102-19P',
        isDocketSuffixHighPriority: true,
      },
    );
    expect(result).toBe(0);
  });

  it('103-19 should come after 102-19', () => {
    const result = compareCasesByDocketNumber(
      {
        docketNumber: '103-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '103-19',
        isDocketSuffixHighPriority: false,
      },
      {
        docketNumber: '102-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '103-19P',
        isDocketSuffixHighPriority: true,
      },
    );
    expect(result).toBe(1);
  });
});
