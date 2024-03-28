import { MAX_SEARCH_RESULTS, ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { caseAdvancedSearchInteractor } from './caseAdvancedSearchInteractor';

describe('caseAdvancedSearchInteractor', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      role: ROLES.petitionsClerk,
    };

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([]);
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    mockUser.role = ROLES.petitioner;

    await expect(
      caseAdvancedSearchInteractor(applicationContext, {} as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns empty array if no search params are passed in', async () => {
    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {} as any,
    );

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for an exact match result', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          docketNumber: '101-20',
          petitioners: [],
        },
        {
          docketNumber: '201-20',
          petitioners: [],
        },
      ]);

    const results = await caseAdvancedSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results).toEqual([
      { docketNumber: '101-20', petitioners: [] },
      { docketNumber: '201-20', petitioners: [] },
    ]);
  });

  it('calls search function with correct params, taking startDate and endDate into account, and returns records for an exact match result', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          docketNumber: '101-20',
          petitioners: [],
        },
        {
          docketNumber: '201-20',
          petitioners: [],
        },
      ]);

    const results = await caseAdvancedSearchInteractor(applicationContext, {
      endDate: '07/29/1993',
      petitionerName: 'test person',
      startDate: '05/18/1985',
    } as any);

    expect(results).toEqual([
      { docketNumber: '101-20', petitioners: [] },
      { docketNumber: '201-20', petitioners: [] },
    ]);
  });

  it('filters out sealed cases for non associated, non authorized users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'b45a0633-acda-499e-8fab-8785baeafed7',
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          docketNumber: '101-20',
          petitioners: [],
          sealedDate: 'yup',
          userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
        },
      ]);

    const results = await caseAdvancedSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results).toEqual([]);
  });

  it('filters out sealed cases that do not have a sealedDate for non associated, non authorized users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'b45a0633-acda-499e-8fab-8785baeafed7',
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          docketNumber: '101-20',
          isSealed: true,
          petitioners: [],
          userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
        },
      ]);

    const results = await caseAdvancedSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results).toEqual([]);
  });

  it('returns no more than MAX_SEARCH_RESULTS', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'b45a0633-acda-499e-8fab-8785baeafed7',
    });

    const maxPlusOneResults = new Array(MAX_SEARCH_RESULTS + 1).fill({
      docketNumber: '101-20',
      petitioners: [],
      userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue(maxPlusOneResults);

    const results = await caseAdvancedSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('returns results if practitioner is associated', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          docketNumber: '101-20',
          irsPractitioners: [
            {
              userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
            },
          ],
          petitioners: [],
          sealedDate: 'yup',
        },
      ]);

    const results = await caseAdvancedSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results).toEqual([
      {
        docketNumber: '101-20',
        irsPractitioners: [
          {
            userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
          },
        ],
        petitioners: [],
        sealedDate: 'yup',
      },
    ]);
  });

  it('returns results for petitionsclerk or internal user always', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          docketNumber: '101-20',
          petitioners: [],
          sealedDate: 'yup',
        },
      ]);

    const results = await caseAdvancedSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results).toEqual([
      {
        docketNumber: '101-20',
        petitioners: [],
        sealedDate: 'yup',
      },
    ]);
  });
});
