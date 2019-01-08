const { getUsersInSection } = require('./getUsersInSection.interactor');

describe('Get users in section', () => {
  it('returns two docket clerks for the docket section', async () => {
    const users = await getUsersInSection({ sectionType: 'docket' });
    expect(users.length).toEqual(2);
    users.forEach(user => {
      expect(user.role).toEqual('docketclerk');
    });
  });
  it('returns all internal users if no section is provided', async () => {
    const users = await getUsersInSection({});
    expect(users.length).toEqual(3);
  });
});
