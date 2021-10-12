const { canAllowPrintableDocketRecord } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('canAllowPrintableDocketRecord', () => {
  it('returns true if the rawCase.canAllowPrintableDocketRecord value is defined and true', () => {
    expect(
      canAllowPrintableDocketRecord({
        ...MOCK_CASE,
        canAllowPrintableDocketRecord: true,
      }),
    ).toEqual(true);
  });

  it('returns false if the rawCase.canAllowPrintableDocketRecord value is defined and false', () => {
    expect(
      canAllowPrintableDocketRecord({
        ...MOCK_CASE,
        canAllowPrintableDocketRecord: false,
      }),
    ).toEqual(false);
  });

  it('returns true if the case is not in NEW status', () => {
    expect(
      canAllowPrintableDocketRecord({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      }),
    ).toEqual(true);
  });

  it('returns false if the case is in NEW status', () => {
    expect(
      canAllowPrintableDocketRecord({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      }),
    ).toEqual(false);
  });
});
