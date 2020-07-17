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
          caseId: '1',
        },
        {
          caseId: '2',
        },
      ]);

    const results = await caseAdvancedSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([{ caseId: '1' }, { caseId: '2' }]);
  });

  it('filters out sealed cases for non associated, non authorized users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          caseId: '1',
          sealedDate: 'yup',
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
      userId: 'abc',
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
        {
          caseId: '1',
          irsPractitioners: [
            {
              userId: 'abc',
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
        caseId: '1',
        irsPractitioners: [
          {
            userId: 'abc',
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
          caseId: '1',
          sealedDate: 'yup',
        },
      ]);

    const results = await caseAdvancedSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      {
        caseId: '1',
        sealedDate: 'yup',
      },
    ]);
  });
});
