import { Case } from './Case';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('hasPendingItems', () => {
  it('should not show the case as having pending items if no docketEntries are pending', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.doesHavePendingItems()).toEqual(false);
  });

  it('should pass through hasPendingItems from raw case data', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        hasPendingItems: true,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.hasPendingItems).toEqual(true);
  });

  it('should default hasPendingItems to false when not provided', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.hasPendingItems).toEqual(false);
  });

  it('should not show the case as having pending items if some docketEntries are pending and not served', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
          pending: true,
          servedAt: undefined,
        },
      ],
    };

    const caseToUpdate = new Case(mockCase, {
      authorizedUser: mockDocketClerkUser,
    });

    expect(caseToUpdate.doesHavePendingItems()).toEqual(false);
  });

  it('should show the case as having pending items if some docketEntries are pending and served', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
          pending: true,
          servedAt: '2019-08-25T05:00:00.000Z',
          servedParties: [{ name: 'Bob' }],
        },
      ],
    };

    const caseToUpdate = new Case(mockCase, {
      authorizedUser: mockDocketClerkUser,
    });

    expect(caseToUpdate.doesHavePendingItems()).toEqual(true);
  });

  it('should show the case as having pending items if isLegacyServed is true', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
          isLegacyServed: true,
          pending: true,
          servedAt: undefined,
          servedParties: undefined,
        },
      ],
    };

    const caseToUpdate = new Case(mockCase, {
      authorizedUser: mockDocketClerkUser,
    });

    expect(caseToUpdate.doesHavePendingItems()).toEqual(true);
  });

  it('recomputeHasPendingItems should update hasPendingItems based on docket entries', () => {
    const mockCase = {
      ...MOCK_CASE,
      hasPendingItems: false,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
          pending: true,
          servedAt: '2019-08-25T05:00:00.000Z',
          servedParties: [{ name: 'Bob' }],
        },
      ],
    };

    const caseToUpdate = new Case(mockCase, {
      authorizedUser: mockDocketClerkUser,
    });

    expect(caseToUpdate.hasPendingItems).toEqual(false);

    caseToUpdate.recomputeHasPendingItems();

    expect(caseToUpdate.hasPendingItems).toEqual(true);
  });
});
