const {
  checkForReadyForTrialCasesInteractor,
} = require('./checkForReadyForTrialCasesInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');

describe('checkForReadyForTrialCasesInteractor', () => {
  it('should successfully run without error', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getAllCatalogCases.mockReturnValue([]);

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
      status: Case.STATUS_TYPES.generalDocket,
    });
    applicationContext
      .getPersistenceGateway()
      .getAllCatalogCases.mockReturnValue([
        { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
      ]);

    let error;

    try {
      await checkForReadyForTrialCasesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
