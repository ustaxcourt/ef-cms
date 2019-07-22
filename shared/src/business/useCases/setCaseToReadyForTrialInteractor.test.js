const {
  setCaseToReadyForTrialInteractor,
} = require('./setCaseToReadyForTrialInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { omit } = require('lodash');
const { User } = require('../entities/User');

describe('set case status to ready for trial', () => {
  let applicationContext;
  let mockCase;

  beforeEach(() => {
    mockCase = MOCK_CASE;
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'bob',
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: () => {},
          getCaseByCaseId: () => Promise.resolve(mockCase),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(new Case(caseToUpdate)),
        };
      },
    };
  });

  it('sets the case status to General Docket - At Issue (Ready for Trial)', async () => {
    const result = await setCaseToReadyForTrialInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(result.status).toEqual(
      'General Docket - At Issue (Ready for Trial)',
    );
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return { userId: 'notauser' };
    };
    let error;
    try {
      await setCaseToReadyForTrialInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized for update case');
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Suzie Petitionsclerk',
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => null,
          updateCase: () => null,
        };
      },
    };
    let error;
    try {
      await setCaseToReadyForTrialInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Suzie Petitionsclerk',
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve(omit(MOCK_CASE, 'docketNumber')),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(new Case(caseToUpdate)),
        };
      },
    };
    let error;
    try {
      await setCaseToReadyForTrialInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
