const { getUserInteractor } = require('./getUserInteractor');
const { User } = require('../entities/User');

describe('getUserInteractor', () => {
  let applicationContext;

  it('calls the persistence method to get the user', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        getUserById: () => ({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          section: 'petitions',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      }),
    };

    let error;
    let user;

    try {
      user = await getUserInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(user).toEqual({
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      section: 'petitions',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('calls the persistence method to get the user (that is a judge)', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Judge',
          role: User.ROLES.judge,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        getUserById: () => ({
          name: 'Test Judge',
          role: User.ROLES.judge,
          section: 'judge',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      }),
    };

    let error;
    let user;

    try {
      user = await getUserInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(user).toEqual({
      name: 'Test Judge',
      role: User.ROLES.judge,
      section: 'judge',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
});
