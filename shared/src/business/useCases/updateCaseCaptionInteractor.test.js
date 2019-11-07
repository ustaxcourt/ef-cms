const {
  updateCaseCaptionInteractor,
} = require('./updateCaseCaptionInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('updateCaseCaptionInteractor', () => {
  let applicationContext;

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'nope',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: caseToUpdate => Promise.resolve(caseToUpdate),
        };
      },
      getUseCases: () => {
        return {
          removeCaseFromTrialInteractor: caseToUpdate =>
            Promise.resolve(caseToUpdate),
        };
      },
    };
    let error;
    try {
      await updateCaseCaptionInteractor({
        applicationContext,
        caseCaption: 'The new case caption',
        caseId: MOCK_CASE.caseId,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });

  it('should call updateCase with the updated case caption and return the updated case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
    const result = await updateCaseCaptionInteractor({
      applicationContext,
      caseCaption: 'The new case caption',
      caseId: MOCK_CASE.caseId,
    });
    expect(result.caseCaption).toEqual('The new case caption');
  });
});
