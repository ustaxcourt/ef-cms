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
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: () => null,
          getCaseByCaseId: () => Promise.resolve(mockCase),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(new Case(caseToUpdate, { applicationContext })),
        };
      },
    };
  });

  it(`sets the case status to ${Case.STATUS_TYPES.generalDocketReadyForTrial}`, async () => {
    const result = await setCaseToReadyForTrialInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(result.status).toEqual(Case.STATUS_TYPES.generalDocketReadyForTrial);
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
          role: User.ROLES.petitionsClerk,
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
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve(omit(MOCK_CASE, 'docketNumber')),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(new Case(caseToUpdate, { applicationContext })),
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

  it('calls createCaseTrialSortMappingRecords if the case is not already associated with a trial session', async () => {
    const caseId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    const createCaseTrialSortMappingRecordsMock = jest.fn();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Suzie Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsMock,
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(new Case(caseToUpdate, { applicationContext })),
        };
      },
    };
    await setCaseToReadyForTrialInteractor({
      applicationContext,
      caseId,
    });
    expect(createCaseTrialSortMappingRecordsMock).toHaveBeenCalled();
    expect(
      createCaseTrialSortMappingRecordsMock.mock.calls[0][0].caseId,
    ).toEqual(caseId);
  });

  it('does not call createCaseTrialSortMappingRecords if the case is already associated with a trial session', async () => {
    const caseId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    const createCaseTrialSortMappingRecordsMock = jest.fn();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Suzie Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsMock,
          getCaseByCaseId: () =>
            Promise.resolve({
              ...MOCK_CASE,
              trialSessionId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            }),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(new Case(caseToUpdate, { applicationContext })),
        };
      },
    };
    await setCaseToReadyForTrialInteractor({
      applicationContext,
      caseId,
    });
    expect(createCaseTrialSortMappingRecordsMock).not.toHaveBeenCalled();
  });
});
