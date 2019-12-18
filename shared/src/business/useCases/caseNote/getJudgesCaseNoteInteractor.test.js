const {
  getJudgesCaseNoteInteractor,
} = require('./getJudgesCaseNoteInteractor');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const MOCK_NOTE = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  notes: 'something',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
};

describe('Get case note', () => {
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
          getJudgesCaseNote: () => {},
        };
      },
      getUseCases: () => ({
        getJudgeForUserChambersInteractor: () => null,
      }),
    };
    await expect(
      getJudgesCaseNoteInteractor({
        applicationContext,
        caseId: MOCK_NOTE.caseId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.judge,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {
          getJudgesCaseNote: () => Promise.resolve(omit(MOCK_NOTE, 'userId')),
        };
      },
      getUseCases: () => ({
        getJudgeForUserChambersInteractor: () => ({
          role: User.ROLES.judge,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        }),
      }),
    };
    let error;
    try {
      await getJudgesCaseNoteInteractor({
        applicationContext,
        caseId: MOCK_NOTE.caseId,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The JudgesCaseNote entity was invalid ValidationError: child "userId" fails because ["userId" is required]',
    );
  });

  it('correctly returns data from persistence', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.judge,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {
          getJudgesCaseNote: () => Promise.resolve(MOCK_NOTE),
        };
      },
      getUseCases: () => ({
        getJudgeForUserChambersInteractor: () => ({
          role: User.ROLES.judge,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        }),
      }),
    };
    const result = await getJudgesCaseNoteInteractor({
      applicationContext,
      caseId: MOCK_NOTE.caseId,
    });
    expect(result).toMatchObject(MOCK_NOTE);
  });

  it('does not return anything if nothing is returned from persistence', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.judge,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {
          getJudgesCaseNote: () => null,
        };
      },
      getUseCases: () => ({
        getJudgeForUserChambersInteractor: () => ({
          role: User.ROLES.judge,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        }),
      }),
    };
    const result = await getJudgesCaseNoteInteractor({
      applicationContext,
      caseId: MOCK_NOTE.caseId,
    });
    expect(result).toEqual(undefined);
  });
});
