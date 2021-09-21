const { canAllowDocumentServiceForCase } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('canAllowDocumentServiceForCase', () => {
  it('returns true if the case is not in NEW status', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      }),
    ).toBeTruthy();
  });

  it('returns false if the case is in NEW status', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      }),
    ).toBeFalsy();
  });
});
