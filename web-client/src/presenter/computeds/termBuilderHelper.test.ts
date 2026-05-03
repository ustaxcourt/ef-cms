import { termBuilderHelper } from './termBuilderHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

jest.mock('@shared/business/utilities/getHolidaysInDateRange', () => ({
  getHolidaysInDateRange: jest.fn(() => [
    {
      name: "New Year's Day",
      dateString: '2025-01-01',
      date: '2025-01-01',
    },
  ]),
}));

describe('termBuilderHelper', () => {
  it('returns holidays and formatted holidays in date range', () => {
    const result = runCompute(termBuilderHelper, {
      state: {
        [STATE_KEYS.TERM_BUILDER_INFORMATION]: {
          termStartDate: '01/01/2025',
          termEndDate: '01/10/2025',
        },
      },
    });

    expect(result.formattedHolidaysInDateRange).toEqual([
      { name: "New Year's Day", date: '1/1' },
    ]);
  });

  it('throws if term state is missing', () => {
    expect(() =>
      runCompute(termBuilderHelper, {
        state: {},
      }),
    ).toThrow('Could not get term state');
  });
});
