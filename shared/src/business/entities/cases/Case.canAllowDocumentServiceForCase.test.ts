import { CASE_STATUS_TYPES } from '../EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { canAllowDocumentServiceForCase } from './Case';

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

  it('returns true if the case is NOT in NEW status', () => {
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

  it('returns true if the case is in CLOSED status', () => {
    expect(
      canAllowDocumentServiceForCase({
        ...MOCK_CASE,
        closedDate: '2019-03-01T21:40:48.000Z',
        status: CASE_STATUS_TYPES.closed,
      }),
    ).toEqual(true);
  });
});
