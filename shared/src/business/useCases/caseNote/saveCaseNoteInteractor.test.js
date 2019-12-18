const { MOCK_CASE } = require('../../../test/mockCase');
const { saveCaseNoteInteractor } = require('./saveCaseNoteInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const updateCaseMock = jest
  .fn()
  .mockImplementation(async ({ caseToUpdate }) => caseToUpdate);
const getCaseByCaseIdMock = jest.fn().mockResolvedValue(MOCK_CASE);

describe('saveCaseNoteInteractor', () => {
  let applicationContext;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
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
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Judge Armen',
          role: User.ROLES.judge,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdMock,
        updateCase: updateCaseMock,
      }),
    };

    let error;
    let result;

    try {
      result = await saveCaseNoteInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        proceduralNote: 'This is my case note',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(getCaseByCaseIdMock).toHaveBeenCalled();
    expect(updateCaseMock).toHaveBeenCalled();
    expect(result.proceduralNote).toEqual('This is my case note');
  });
});
