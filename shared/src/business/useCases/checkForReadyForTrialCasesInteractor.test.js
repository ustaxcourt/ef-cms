const sinon = require('sinon');
const {
  checkForReadyForTrialCases,
} = require('./checkForReadyForTrialCasesInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { STATUS_TYPES } = require('../entities/Case');

describe('checkForReadyForTrialCases', () => {
  let applicationContext;
  let updateCaseSpy;

  it('should successfully run without error', async () => {
    const getAllCatalogCasesSpy = sinon.stub().returns([]);
    applicationContext = {
      getPersistenceGateway: () => ({
        getAllCatalogCases: getAllCatalogCasesSpy,
        getCaseByCaseId: () => MOCK_CASE,
        updateCase: () => {},
      }),
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCases({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(getAllCatalogCasesSpy.called).toEqual(true);
  });

  it('should not check case if no case is found', async () => {
    const getAllCatalogCasesSpy = sinon.stub().returns([]);
    applicationContext = {
      getPersistenceGateway: () => ({
        getAllCatalogCases: getAllCatalogCasesSpy,
        getCaseByCaseId: () => undefined,
        updateCase: () => {},
      }),
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCases({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(getAllCatalogCasesSpy.called).toEqual(true);
  });

  it("should only check cases that are 'general docket not at issue'", async () => {
    updateCaseSpy = sinon.spy();
    applicationContext = {
      getPersistenceGateway: () => ({
        getAllCatalogCases: () => [
          { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        ],
        getCaseByCaseId: () => MOCK_CASE,
        updateCase: updateCaseSpy,
      }),
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCases({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(updateCaseSpy.called).toEqual(false);
  });

  it("should update cases to 'ready for trial' that meet requirements", async () => {
    /**
     * Requirements:
     * 1. Case has status 'General Docket - Not at Issue'
     * 2. Case has had an 'Answer' type document filed
     * 3. The cutoff(45 days) has passed since the first Answer document was submitted.
     */

    updateCaseSpy = sinon.spy();
    applicationContext = {
      getPersistenceGateway: () => ({
        getAllCatalogCases: () => [
          { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        ],
        getCaseByCaseId: () => ({
          ...MOCK_CASE,
          status: STATUS_TYPES.generalDocket,
        }),
        updateCase: updateCaseSpy,
      }),
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      await checkForReadyForTrialCases({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(updateCaseSpy.called).toEqual(true);
  });
});
