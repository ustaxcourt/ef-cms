const sinon = require('sinon');
const {
  updateCaseTrialSortTagsInteractor,
} = require('./updateCaseTrialSortTagsInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { omit } = require('lodash');
const { User } = require('../entities/User');

describe('Update case trial sort tags', () => {
  let applicationContext;
  let mockCase;
  let updateCaseTrialSortMappingRecordsStub = sinon.stub().resolves(null);

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
          getCaseByCaseId: () => Promise.resolve(mockCase),
          updateCaseTrialSortMappingRecords: updateCaseTrialSortMappingRecordsStub,
        };
      },
    };
  });

  it('does not call persistence if case status is not ready for trial', async () => {
    await updateCaseTrialSortTagsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
    });

    expect(updateCaseTrialSortMappingRecordsStub.called).toBeFalsy();
  });

  it('calls persistence if case status is ready for trial', async () => {
    mockCase.status = Case.STATUS_TYPES.generalDocketReadyForTrial;
    await updateCaseTrialSortTagsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
    });

    expect(updateCaseTrialSortMappingRecordsStub.called).toBeTruthy();
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return { userId: 'notauser' };
    };
    let error;
    try {
      await updateCaseTrialSortTagsInteractor({
        applicationContext,
        caseId: mockCase.caseId,
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
      await updateCaseTrialSortTagsInteractor({
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
            Promise.resolve(
              new Case({ applicationContext, rawCase: caseToUpdate }),
            ),
        };
      },
    };
    let error;
    try {
      await updateCaseTrialSortTagsInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'petitionsclerk',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
