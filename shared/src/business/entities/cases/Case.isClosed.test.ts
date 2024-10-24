import { CASE_STATUS_TYPES, CLOSED_CASE_STATUSES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('isClosed', () => {
  it(`should return false when the case status is NOT one of ${CLOSED_CASE_STATUSES}`, () => {
    const caseEntity = new Case(
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.generalDocket },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isClosed = caseEntity.isClosed();

    expect(isClosed).toBe(false);
  });

  it('should return false when the case status is undefined', () => {
    const caseEntity = new Case(
      { ...MOCK_CASE, status: undefined },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isClosed = caseEntity.isClosed();

    expect(isClosed).toBe(false);
  });

  it('should return true when the case status is "Closed"', () => {
    const caseEntity = new Case(
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.closed },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isClosed = caseEntity.isClosed();

    expect(isClosed).toBe(true);
  });

  it('should return true when the case status is "Closed - Dismissed"', () => {
    const caseEntity = new Case(
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.closedDismissed },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isClosed = caseEntity.isClosed();

    expect(isClosed).toBe(true);
  });
});
