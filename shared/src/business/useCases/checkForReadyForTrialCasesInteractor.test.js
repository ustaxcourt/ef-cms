const {
  checkForReadyForTrialCasesInteractor,
} = require('./checkForReadyForTrialCasesInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('checkForReadyForTrialCasesInteractor', () => {
  let mockCatalogCases;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getAllCatalogCases.mockImplementation(() => mockCatalogCases);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});
  });

  it('should successfully run without error', async () => {
    mockCatalogCases = [];
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);

    await expect(
      checkForReadyForTrialCasesInteractor({
        applicationContext,
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getAllCatalogCases,
    ).toBeCalled();
  });

  it('should not check case if no case is found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(undefined);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCatalogCases = [{ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }];

    await expect(
      checkForReadyForTrialCasesInteractor({
        applicationContext,
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getAllCatalogCases,
    ).toBeCalled();
  });

  it("should only check cases that are 'general docket not at issue'", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCatalogCases = [{ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }];

    await expect(
      checkForReadyForTrialCasesInteractor({
        applicationContext,
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toBeCalled();
  });

  it("should not update case to 'ready for trial' if it does not have answer document", async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      ...MOCK_CASE,
      documents: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Petition',
          processingStatus: 'pending',
          userId: 'petitioner',
          workItems: [],
        },
      ],
      status: CASE_STATUS_TYPES.generalDocket,
    });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCatalogCases = [{ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }];

    await expect(
      checkForReadyForTrialCasesInteractor({
        applicationContext,
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toBeCalled();
  });

  it("should update cases to 'ready for trial' that meet requirements", async () => {
    /**
     * Requirements:
     * 1. Case has status 'General Docket - Not at Issue'
     * 2. Case has had an 'Answer' type document filed
     * 3. The cutoff(45 days) has passed since the first Answer document was submitted.
     */
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocket,
    });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCatalogCases = [{ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }];
    applicationContext
      .getPersistenceGateway()
      .getAllCatalogCases.mockReturnValue([
        { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
      ]);

    await expect(
      checkForReadyForTrialCasesInteractor({
        applicationContext,
      }),
    ).resolves.not.toThrow();

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
