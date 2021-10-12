const { calculateISODate } = require('../../utilities/DateHandler');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { shouldGenerateNoticesForCase } = require('./Case');

describe('shouldGenerateNoticesForCase', () => {
  it('returns true if the rawCase.shouldGenerateNotices value is defined and true', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        shouldGenerateNotices: true,
      }),
    ).toEqual(true);
  });

  it('returns false if the rawCase.shouldGenerateNotices value is defined and false', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        shouldGenerateNotices: false,
      }),
    ).toEqual(false);
  });

  it('returns true if the case is in Open (neither New nor Closed) status', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      }),
    ).toEqual(true);
  });

  it('returns false if the case is in NEW status', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      }),
    ).toEqual(false);
  });

  it('returns false if the case is closed more than six months ago', () => {
    expect(
      shouldGenerateNoticesForCase({
        ...MOCK_CASE,
        closedDate: '2019-03-01T21:40:48.000Z',
        status: CASE_STATUS_TYPES.closed,
      }),
    ).toEqual(false);
  });

  it('returns true if the case is closed within the last six months', () => {
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
