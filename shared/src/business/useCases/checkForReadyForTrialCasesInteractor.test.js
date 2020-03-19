const {
  checkForReadyForTrialCasesInteractor,
} = require('./checkForReadyForTrialCasesInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('checkForReadyForTrialCasesInteractor', () => {
  let applicationContext;
  let updateCaseSpy;

  it('should successfully run without error', async () => {
    const getAllCatalogCasesSpy = jest.fn().mockReturnValue([]);
    applicationContext = {
      getPersistenceGateway: () => ({
        createCaseTrialSortMappingRecords: () => {},
        getAllCatalogCases: getAllCatalogCasesSpy,
        getCaseByCaseId: () => MOCK_CASE,
        getCurrentUser: () =>
          MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
        updateCase: () => {},
      }),
      getUniqueId: () => 'unique-id-1',
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCasesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(getAllCatalogCasesSpy).toBeCalled();
  });

  it('should not check case if no case is found', async () => {
    const getAllCatalogCasesSpy = jest
      .fn()
      .mockReturnValue([{ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }]);
    applicationContext = {
      getPersistenceGateway: () => ({
        createCaseTrialSortMappingRecords: () => {},
        getAllCatalogCases: getAllCatalogCasesSpy,
        getCaseByCaseId: () => undefined,
        updateCase: () => {},
      }),
      getUniqueId: () => 'unique-id-1',
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCasesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(getAllCatalogCasesSpy).toBeCalled();
  });

  it("should only check cases that are 'general docket not at issue'", async () => {
    updateCaseSpy = jest.fn();
    applicationContext = {
      getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      getPersistenceGateway: () => ({
        createCaseTrialSortMappingRecords: () => {},
        getAllCatalogCases: () => [
          { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        ],
        getCaseByCaseId: () => MOCK_CASE,
        updateCase: updateCaseSpy,
      }),
      getUniqueId: () => 'unique-id-1',
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCasesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(updateCaseSpy).not.toBeCalled();
  });

  it("should not update case to 'ready for trial' if it does not have answer document", async () => {
    updateCaseSpy = jest.fn();
    applicationContext = {
      getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      getPersistenceGateway: () => ({
        getAllCatalogCases: () => [
          { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        ],
        getCaseByCaseId: () => ({
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
          status: Case.STATUS_TYPES.generalDocket,
        }),
        updateCase: updateCaseSpy,
      }),
      getUniqueId: () => 'unique-id-1',
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCasesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(updateCaseSpy).not.toBeCalled();
  });

  it("should update cases to 'ready for trial' that meet requirements", async () => {
    /**
     * Requirements:
     * 1. Case has status 'General Docket - Not at Issue'
     * 2. Case has had an 'Answer' type document filed
     * 3. The cutoff(45 days) has passed since the first Answer document was submitted.
     */

    updateCaseSpy = jest.fn();
    applicationContext = {
      getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      getPersistenceGateway: () => ({
        createCaseTrialSortMappingRecords: () => {},
        getAllCatalogCases: () => [
          { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        ],
        getCaseByCaseId: () => ({
          ...MOCK_CASE,
          status: Case.STATUS_TYPES.generalDocket,
        }),
        updateCase: updateCaseSpy,
      }),
      getUniqueId: () => 'unique-id-1',
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCasesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(updateCaseSpy).toBeCalled();
  });
});
