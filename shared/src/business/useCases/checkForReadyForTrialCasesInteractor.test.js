const {
  checkForReadyForTrialCasesInteractor,
} = require('./checkForReadyForTrialCasesInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('checkForReadyForTrialCasesInteractor', () => {
  let mockCasesReadyForTrial;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockImplementation(() => mockCasesReadyForTrial);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});
  });

  it('should successfully run without error', async () => {
    mockCasesReadyForTrial = [];
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getReadyForTrialCases,
    ).toBeCalled();
  });

  it('should not check case if no case is found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(undefined);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getReadyForTrialCases,
    ).toBeCalled();
  });

  it("should only check cases that are 'general docket - not at issue'", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toBeCalled();
  });

  it("should not update case to 'ready for trial' if it does not have answer document", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            processingStatus: 'pending',
            userId: 'petitioner',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
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
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];
    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockReturnValue([{ docketNumber: '101-20' }]);

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('should not call createCaseTrialSortMappingRecords if case has no trial city', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        preferredTrialCity: null,
        status: CASE_STATUS_TYPES.generalDocket,
      });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];
    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockReturnValue([{ docketNumber: '101-20' }]);

    await checkForReadyForTrialCasesInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();
  });
});
