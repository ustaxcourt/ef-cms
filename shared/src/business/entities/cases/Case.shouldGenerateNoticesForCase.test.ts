import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { calculateISODate } from '../../utilities/DateHandler';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('shouldGenerateNoticesForCase', () => {
  it('checks if the case is eligible for service (true)', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseEntity.shouldGenerateNoticesForCase()).toBeTruthy();
  });

  it('checks if the case is eligible for service (false)', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseEntity.shouldGenerateNoticesForCase()).toBeFalsy();
  });

  it('verifies that the case is NOT eligible because the case was closed over 6 months ago (false)', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        closedDate: '2019-03-01T21:40:48.000Z',
        status: CASE_STATUS_TYPES.closed,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseEntity.shouldGenerateNoticesForCase()).toBeFalsy();
  });

  it('verifies that the case is eligible because the case was closed under 6 months ago (false)', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        closedDate: calculateISODate({
          howMuch: -5,
          units: 'months',
        }),
        status: CASE_STATUS_TYPES.closed,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseEntity.shouldGenerateNoticesForCase()).toBeTruthy();
  });
});
