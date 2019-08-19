const {
  getTrialSessionWorkingCopyInteractor,
} = require('./getTrialSessionWorkingCopyInteractor');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

const MOCK_WORKING_COPY = {
  sort: 'practitioner',
  sortOrder: 'desc',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
};

describe('Get trial session working copy', () => {
  let applicationContext;

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'unauthorizedRole',
          userId: 'unauthorizedUser',
        };
      },
      getPersistenceGateway: () => {
        return {
          getTrialSessionWorkingCopy: () => {},
        };
      },
    };
    await expect(
      getTrialSessionWorkingCopyInteractor({
        applicationContext,
        trialSessionId: MOCK_WORKING_COPY.trialSessionId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'judge',
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {
          getTrialSessionWorkingCopy: () =>
            Promise.resolve(omit(MOCK_WORKING_COPY, 'userId')),
        };
      },
    };
    let error;
    try {
      await getTrialSessionWorkingCopyInteractor({
        applicationContext,
        trialSessionId: MOCK_WORKING_COPY.trialSessionId,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The TrialSessionWorkingCopy entity was invalid ValidationError: child "userId" fails because ["userId" is required]',
    );
  });

  it('correctly returns data from persistence', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'judge',
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {
          getTrialSessionWorkingCopy: () => Promise.resolve(MOCK_WORKING_COPY),
        };
      },
    };
    const result = await getTrialSessionWorkingCopyInteractor({
      applicationContext,
      trialSessionId: MOCK_WORKING_COPY.trialSessionId,
    });
    expect(result).toMatchObject(MOCK_WORKING_COPY);
  });
});
