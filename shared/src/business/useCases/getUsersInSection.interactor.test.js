const { getUsersInSection } = require('./getUsersInSection.interactor');

describe('Get users in section', () => {
  const applicationContext = {
    getCurrentUser: () => {
      return { userId: 'docketclerk' };
    },
  };

  it('returns two docket clerks for the docket section', async () => {
    const section = { userId: 'docketclerk', sectionType: 'docket' };
    const users = await getUsersInSection({ section, applicationContext });
    expect(users.length).toEqual(2);
    users.forEach(user => {
      expect(user.role).toEqual('docketclerk');
    });
  });
});
