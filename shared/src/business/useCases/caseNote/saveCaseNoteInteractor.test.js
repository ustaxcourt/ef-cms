const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { saveCaseNoteInteractor } = require('./saveCaseNoteInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('saveCaseNoteInteractor', () => {
  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    let error;
    try {
      await saveCaseNoteInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('saves a case note', async () => {
    const mockJudge = new User({
      name: 'Judge Armen',
      role: ROLES.judge,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockReturnValue(mockJudge);

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(async ({ caseToUpdate }) => caseToUpdate);

    let error;
    let result;

    try {
      result = await saveCaseNoteInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        caseNote: 'This is my case note',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.caseNote).toEqual('This is my case note');
  });
});
