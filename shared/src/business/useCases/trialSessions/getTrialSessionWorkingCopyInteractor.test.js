const {
  getTrialSessionWorkingCopyInteractor,
} = require('./getTrialSessionWorkingCopyInteractor');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const MOCK_WORKING_COPY = {
  sort: 'practitioner',
  sortOrder: 'desc',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
};

describe('Get trial session working copy', () => {
  let applicationContext;
  let user;
  let getTrialSessionWorkingCopyMock;
  let getJudgeForUserChambersInteractorMock;

  beforeEach(() => {
    jest.clearAllMocks();

    getTrialSessionWorkingCopyMock = jest
      .fn()
      .mockResolvedValue(MOCK_WORKING_COPY);
    getJudgeForUserChambersInteractorMock = jest.fn().mockReturnValue({
      role: User.ROLES.judge,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });

    user = {
      role: User.ROLES.judge,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getPersistenceGateway: () => ({
        getTrialSessionWorkingCopy: getTrialSessionWorkingCopyMock,
      }),
      getUseCases: () => ({
        getJudgeForUserChambersInteractor: getJudgeForUserChambersInteractorMock,
      }),
    };
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };

    await expect(
      getTrialSessionWorkingCopyInteractor({
        applicationContext,
        trialSessionId: MOCK_WORKING_COPY.trialSessionId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    getTrialSessionWorkingCopyMock = jest
      .fn()
      .mockResolvedValue(omit(MOCK_WORKING_COPY, 'userId'));

    await expect(
      getTrialSessionWorkingCopyInteractor({
        applicationContext,
        trialSessionId: MOCK_WORKING_COPY.trialSessionId,
      }),
    ).rejects.toThrow(
      'The TrialSessionWorkingCopy entity was invalid ValidationError: "userId" is required',
    );
  });

  it('correctly returns data from persistence for a judge user (default user for test)', async () => {
    const result = await getTrialSessionWorkingCopyInteractor({
      applicationContext,
      trialSessionId: MOCK_WORKING_COPY.trialSessionId,
    });
    expect(result).toMatchObject(MOCK_WORKING_COPY);
  });

  it('does not return data if none is returned from persistence', async () => {
    getTrialSessionWorkingCopyMock = jest.fn();

    const result = await getTrialSessionWorkingCopyInteractor({
      applicationContext,
      trialSessionId: MOCK_WORKING_COPY.trialSessionId,
    });
    expect(result).toBeUndefined();
  });

  it('correctly returns data from persistence for a trial clerk user', async () => {
    user = {
      role: User.ROLES.trialClerk,
      userId: 'a9ae05ba-d48a-43a6-9981-ee536a7601be',
    };
    getJudgeForUserChambersInteractorMock = jest.fn();

    const result = await getTrialSessionWorkingCopyInteractor({
      applicationContext,
      trialSessionId: MOCK_WORKING_COPY.trialSessionId,
    });
    expect(getTrialSessionWorkingCopyMock.mock.calls[0][0]).toMatchObject({
      userId: 'a9ae05ba-d48a-43a6-9981-ee536a7601be',
    });
    expect(result).toMatchObject(MOCK_WORKING_COPY);
  });
});
