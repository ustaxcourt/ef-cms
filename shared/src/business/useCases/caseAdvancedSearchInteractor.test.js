const {
  caseAdvancedSearchInteractor,
} = require('./caseAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ROLES } = require('../entities/EntityConstants');

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
      caseAdvancedSearchInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns empty array if no search params are passed in', async () => {
    const results = await caseAdvancedSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for an exact match result', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          docketNumber: '101-20',
        },
        {
          docketNumber: '201-20',
        },
      ]);

    const results = await caseAdvancedSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      { docketNumber: '101-20' },
      { docketNumber: '201-20' },
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
          contactPrimary: {},
          docketNumber: '101-20',
          sealedDate: 'yup',
          userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
        },
      ]);

    const results = await caseAdvancedSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([]);
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
          contactPrimary: {},
          docketNumber: '101-20',
          irsPractitioners: [
            {
              userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
            },
          ],
          sealedDate: 'yup',
        },
      ]);

    const results = await caseAdvancedSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      {
        contactPrimary: {},
        docketNumber: '101-20',
        irsPractitioners: [
          {
            userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
          },
        ],
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
          contactPrimary: {},
          docketNumber: '101-20',
          sealedDate: 'yup',
        },
      ]);

    const results = await caseAdvancedSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      {
        contactPrimary: {},
        docketNumber: '101-20',
        sealedDate: 'yup',
      },
    ]);
  });
});
