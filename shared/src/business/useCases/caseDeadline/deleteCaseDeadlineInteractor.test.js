const {
  deleteCaseDeadlineInteractor,
} = require('./deleteCaseDeadlineInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('deleteCaseDeadlineInteractor', () => {
  let applicationContext;

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await deleteCaseDeadlineInteractor({
        applicationContext,
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('deletes a case deadline', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        deleteCaseDeadline: v => v,
      }),
    };

    let error;
    let caseDeadline;

    try {
      caseDeadline = await deleteCaseDeadlineInteractor({
        applicationContext,
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseDeadline).toBeDefined();
  });
});
