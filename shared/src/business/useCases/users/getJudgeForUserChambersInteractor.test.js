const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getJudgeForUserChambersInteractor,
} = require('./getJudgeForUserChambersInteractor');
const { ROLES } = require('../../entities/EntityConstants');

let currentUser;

const chambersUser = {
  role: ROLES.chambers,
  section: 'judgesChambers',
  userId: 'chambers1',
};

const judgeUser = {
  role: ROLES.judge,
  section: 'judgesChambers',
  userId: 'judge1',
};

const allUsers = [
  {
    role: ROLES.docketClerk,
    section: 'docket',
    userId: 'docketclerk1',
  },
  { ...judgeUser },
  {
    role: ROLES.judge,
    section: 'judgesChambers2',
    userId: 'judge2',
  },
  { ...chambersUser },
  {
    role: ROLES.chambers,
    section: 'judgesChambers',
    userId: 'chambers2',
  },
  {
    role: ROLES.chambers,
    section: 'judgesChambers2',
    userId: 'chambers3',
  },
];

describe('getJudgeForUserChambersInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => currentUser);
    applicationContext
      .getUseCases()
      .getUserInteractor.mockImplementation(() => {
        const currentUser = applicationContext.getCurrentUser();
        return allUsers.find(user => user.userId === currentUser.userId);
      });
    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockImplementation(async ({ section }) => {
        return allUsers.filter(user => user.section === section);
      });
  });

  it('Fetches the judge associated with a given chambers user', async () => {
    currentUser = chambersUser;

    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: chambersUser,
    });
    expect(result).toMatchObject(judgeUser);
    expect(
      applicationContext.getUseCases().getUserInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getUsersInSectionInteractor,
    ).toHaveBeenCalled();
  });

  it('Fetches the judge associated with a given chambers user when the user is a judge', async () => {
    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: judgeUser,
    });
    expect(result).toMatchObject(judgeUser);
    expect(
      applicationContext.getUseCases().getUserInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getUsersInSectionInteractor,
    ).not.toHaveBeenCalled();
  });

  it('Calls persistence methods to look up the user if the given `user.section` is undefined', async () => {
    currentUser = {
      role: chambersUser.role,
      userId: chambersUser.userId,
    };

    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: currentUser,
    });
    expect(result).toMatchObject(judgeUser);
    expect(
      applicationContext.getUseCases().getUserInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getUsersInSectionInteractor,
    ).toHaveBeenCalled();
  });

  it('Returns no user if the given user is not associated with any chambers section', async () => {
    currentUser = {
      role: ROLES.docketClerk,
      userId: 'docketclerk1',
    };

    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: currentUser,
    });
    expect(result).toBeUndefined();
    expect(
      applicationContext.getUseCases().getUserInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getUsersInSectionInteractor,
    ).not.toHaveBeenCalled();
  });
});
