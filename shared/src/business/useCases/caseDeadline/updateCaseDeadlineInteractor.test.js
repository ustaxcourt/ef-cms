const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateCaseDeadlineInteractor,
} = require('./updateCaseDeadlineInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('updateCaseDeadlineInteractor', () => {
  const mockCaseDeadline = {
    caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
  };

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    let error;
    try {
      await updateCaseDeadlineInteractor({
        applicationContext,
        caseDeadline: mockCaseDeadline,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('updates a case deadline', async () => {
    const mockPetitionsClerk = new User({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);
    applicationContext.getPersistenceGateway().updateCaseDeadline = v => v;

    let error;
    let caseDeadline;

    try {
      caseDeadline = await updateCaseDeadlineInteractor({
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
