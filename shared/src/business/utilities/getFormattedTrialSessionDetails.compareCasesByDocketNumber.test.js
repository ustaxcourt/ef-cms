import { applicationContext } from '../test/createTestApplicationContext';
import {
  compareCasesByDocketNumber,
  compareCasesByDocketNumberFactory,
} from './getFormattedTrialSessionDetails';

describe('getFormattedTrialSessionDetails.compareCasesByDocketNumber', () => {
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

  it('190-07 should come before 102-19', () => {
    const result = compareCasesByDocketNumber(
      {
        docketNumber: '190-07',
      },
      {
        docketNumber: '102-19',
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
});

describe('getFormattedTrialSessionDetails.compareCasesByDocketNumberFactory', () => {
  it('101-19 should come before 102-19', () => {
    const result = compareCasesByDocketNumberFactory({
      allCases: [],
      applicationContext,
    })(
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

  it('190-07 should come before 102-19', () => {
    const result = compareCasesByDocketNumberFactory({
      allCases: [],
      applicationContext,
    })(
      {
        docketNumber: '190-07',
      },
      {
        docketNumber: '102-19',
      },
    );
    expect(result).toBe(-1);
  });

  it('102-19 should equal 102-19', () => {
    const result = compareCasesByDocketNumberFactory({
      allCases: [],
      applicationContext,
    })(
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
    const result = compareCasesByDocketNumberFactory({
      allCases: [],
      applicationContext,
    })(
      {
        docketNumber: '103-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '103-19',
        isDocketSuffixHighPriority: false,
      },
      {
        docketNumber: '102-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '102-19P',
        isDocketSuffixHighPriority: true,
      },
    );
    expect(result).toBe(1);
  });

  it('a set of cases that contains a consolidated grouping', () => {
    const cases = [
      {
        docketNumber: '101-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '102-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '104-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '103-20',
      },
      {
        docketNumber: '110-19',
      },
    ];

    cases.sort(
      compareCasesByDocketNumberFactory({
        allCases: [
          {
            docketNumber: '101-20',
            leadDocketNumber: '101-20',
          },
        ],
        applicationContext,
      }),
    );

    expect(cases).toEqual([
      expect.objectContaining({
        docketNumber: '110-19',
      }),
      expect.objectContaining({
        docketNumber: '101-20',
      }),
      expect.objectContaining({
        docketNumber: '102-20',
      }),
      expect.objectContaining({
        docketNumber: '104-20',
      }),
      expect.objectContaining({
        docketNumber: '103-20',
      }),
    ]);
  });

  it('a set of cases that contains a consolidated grouping and the lead case is missing', () => {
    const cases = [
      {
        docketNumber: '102-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '104-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '103-20',
      },
      {
        docketNumber: '110-19',
      },
    ];

    cases.sort(
      compareCasesByDocketNumberFactory({
        allCases: [],
        applicationContext,
      }),
    );

    expect(cases).toEqual([
      expect.objectContaining({
        docketNumber: '110-19',
      }),
      expect.objectContaining({
        docketNumber: '102-20',
      }),
      expect.objectContaining({
        docketNumber: '103-20',
      }),
      expect.objectContaining({
        docketNumber: '104-20',
      }),
    ]);
  });
});
