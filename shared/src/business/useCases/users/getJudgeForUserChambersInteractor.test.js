import { getJudgeForUserChambersInteractor } from './getJudgeForUserChambersInteractor';
const { User } = require('../../entities/User');

let applicationContext;
let getUserInteractorMock;
let getUsersInSectionInteractorMock;

const chambersUser = {
  role: User.ROLES.chambers,
  section: 'judgesChambers',
  userId: 'chambers1',
};

const judgeUser = {
  role: User.ROLES.judge,
  section: 'judgesChambers',
  userId: 'judge1',
};

const allUsers = [
  {
    role: User.ROLES.docketClerk,
    section: 'docket',
    userId: 'docketclerk1',
  },
  { ...judgeUser },
  {
    role: User.ROLES.judge,
    section: 'judgesChambers2',
    userId: 'judge2',
  },
  { ...chambersUser },
  {
    role: User.ROLES.chambers,
    section: 'judgesChambers',
    userId: 'chambers2',
  },
  {
    role: User.ROLES.chambers,
    section: 'judgesChambers2',
    userId: 'chambers3',
  },
];

describe('getJudgeForUserChambersInteractor', () => {
  beforeEach(() => {
    getUserInteractorMock = jest.fn();
    getUsersInSectionInteractorMock = jest.fn();

    applicationContext = {
      getUseCases: () => ({
        getUserInteractor: () => {
          getUserInteractorMock();
          const currentUser = applicationContext.getCurrentUser();
          return allUsers.find(user => user.userId === currentUser.userId);
        },
        getUsersInSectionInteractor: ({ section }) => {
          getUsersInSectionInteractorMock();
          return allUsers.filter(user => user.section === section);
        },
      }),
    };
  });

  it('Fetches the judge associated with a given chambers user', async () => {
    applicationContext.getCurrentUser = () => chambersUser;

    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: chambersUser,
    });
    expect(result).toMatchObject(judgeUser);
    expect(getUserInteractorMock).not.toHaveBeenCalled();
    expect(getUsersInSectionInteractorMock).toHaveBeenCalled();
  });

  it('Fetches the judge associated with a given chambers user when the user is a judge', async () => {
    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: judgeUser,
    });
    expect(result).toMatchObject(judgeUser);
    expect(getUserInteractorMock).not.toHaveBeenCalled();
    expect(getUsersInSectionInteractorMock).not.toHaveBeenCalled();
  });

  it('Calls persistence methods to look up the user if the given `user.section` is undefined', async () => {
    const userWithMissingSection = {
      role: chambersUser.role,
      userId: chambersUser.userId,
    };

    applicationContext.getCurrentUser = () => userWithMissingSection;

    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: userWithMissingSection,
    });
    expect(result).toMatchObject(judgeUser);
    expect(getUserInteractorMock).toHaveBeenCalled();
    expect(getUsersInSectionInteractorMock).toHaveBeenCalled();
  });

  it('Returns no user if the given user is not associated with any chambers section', async () => {
    const nonAssociatedUser = {
      role: User.ROLES.docketClerk,
      userId: 'docketclerk1',
    };

    applicationContext.getCurrentUser = () => nonAssociatedUser;

    const result = await getJudgeForUserChambersInteractor({
      applicationContext,
      user: nonAssociatedUser,
    });
    expect(result).toBeUndefined();
    expect(getUserInteractorMock).toHaveBeenCalled();
    expect(getUsersInSectionInteractorMock).toHaveBeenCalled();
  });
});
