const {
  createCaseDeadlineInteractor,
} = require('./createCaseDeadlineInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('createCaseDeadlineInteractor', () => {
  let applicationContext;
  const mockCaseDeadline = {
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
  };

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await createCaseDeadlineInteractor({
        applicationContext,
        caseDeadline: mockCaseDeadline,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('creates a case deadline', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Taxpayer',
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        createCaseDeadline: v => v,
      }),
    };

    let error;
    let caseDeadline;

    try {
      caseDeadline = await createCaseDeadlineInteractor({
        applicationContext,
        caseDeadline: mockCaseDeadline,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseDeadline).toBeDefined();
  });
});
