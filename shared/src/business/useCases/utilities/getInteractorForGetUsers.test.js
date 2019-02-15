const { getInteractorForGetUsers } = require('./getInteractorForGetUsers');

const { getUsersInSection } = require('../users/getUsersInSection.interactor');

describe('getInteractorForGetUsers', () => {
  it('throws an error with a bad user', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'anybillybobthorntoncharacter',
          role: 'anybillybobthorntonrole',
        };
      },
    };
    let error;
    const section = { sectionId: 'petitions' };

    try {
      await getInteractorForGetUsers({
        section,
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('returns the correct interactor for an internal court user', async () => {
    const user = { userId: 'petitionsclerk', role: 'petitionsclerk' };
    const applicationContext = {
      getCurrentUser: () => {
        return user;
      },
    };
    const section = { sectionId: 'petitions' };

    const result = await getInteractorForGetUsers({
      section,
      applicationContext,
    });
    expect(result).toEqual(getUsersInSection);
  });
});
