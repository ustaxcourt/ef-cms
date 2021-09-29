const { calculateISODate } = require('../../utilities/DateHandler');
const { canAllowDocumentServiceForCase } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('canAllowDocumentServiceForCase', () => {
  it('returns true if the rawCase.canAllowDocumentService value is defined and true', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        canAllowDocumentService: true,
      }),
    ).toEqual(true);
  });

  it('returns false if the rawCase.canAllowDocumentService value is defined and false', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        canAllowDocumentService: false,
      }),
    ).toEqual(false);
  });

  it('returns true if the case is not in NEW status', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      }),
    ).toEqual(true);
  });

  it('returns false if the case is in NEW status', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      }),
    ).toEqual(false);
  });

  it('returns false if the case is closed more than six months ago', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        closedDate: '2019-03-01T21:40:48.000Z',
        status: CASE_STATUS_TYPES.closed,
      }),
    ).toEqual(false);
  });

  it('returns true if the case is closed within the last six months', () => {
    expect(
      canAllowDocumentServiceForCase({
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
