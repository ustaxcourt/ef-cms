import { CASE_STATUS_TYPES } from '../EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { calculateISODate } from '../../utilities/DateHandler';
import { shouldGenerateNoticesForCase } from './Case';

describe('shouldGenerateNoticesForCase', () => {
  it('should return the value of rawCase.shouldGenerateNotices when it is defined', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        shouldGenerateNotices: true,
      }),
    ).toEqual(true);
  });

  it('should return true when the case has a status that is considered open (neither New nor Closed)', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      }),
    ).toEqual(true);
  });

  it('should return false when the case status is New', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      }),
    ).toEqual(false);
  });

  it('should return false when the case was closed more than six months ago', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        closedDate: '2019-03-01T21:40:48.000Z',
        status: CASE_STATUS_TYPES.closed,
      }),
    ).toEqual(false);
  });

  it('should return true when the case was closed within the last six months', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        closedDate: calculateISODate({
          howMuch: -5,
          units: 'months',
        }),
        status: CASE_STATUS_TYPES.closed,
      }),
    ).toEqual(true);
  });
});
