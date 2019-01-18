const { getUsersInSection } = require('./getUsersInSection.interactor');

describe('Get users in section', () => {
  describe('for docketclerk', () => {
    const applicationContext = {
      getCurrentUser: () => {
        return { userId: 'docketclerk' };
      },
    };

    it('complains if no section is provided', async () => {
      let error;
      try {
        await getUsersInSection({ applicationContext });
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(
        error.message.indexOf('section must be provided') > -1,
      ).toBeTruthy();
    });

    it('returns two docket clerks for the docket section', async () => {
      const section = { userId: 'docketclerk', sectionType: 'docket' };
      const users = await getUsersInSection({ section, applicationContext });
      expect(users.length).toEqual(2);
      users.forEach(user => {
        expect(user.role).toEqual('docketclerk');
      });
    });
  });
  describe('for petitionsclerk', () => {
    const applicationContext = {
      getCurrentUser: () => {
        return { userId: 'petitionsclerk' };
      },
    };

    it('returns two petitions clerks for the petitions section', async () => {
      const section = { userId: 'petitionsclerk', sectionType: 'petitions' };
      const users = await getUsersInSection({ section, applicationContext });
      expect(users.length).toEqual(2);
      users.forEach(user => {
        expect(user.role).toEqual('petitionsclerk');
      });
    });
  });

  describe('for a different role', () => {
    const applicationContext = {
      getCurrentUser: () => {
        return { userId: 'seniorattorney' };
      },
    };

    it('throws an error when provided an invalid sectionType', async () => {
      const section = { userId: 'seniorattorney', sectionType: 'potatoes' };
      let error;
      try {
        await getUsersInSection({ section, applicationContext });
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error.message.indexOf('Invalid section') > -1).toBeTruthy();
    });
  });

  describe('invalid user', () => {
    const applicationContext = {
      getCurrentUser: () => {
        return { userId: 'badactor' };
      },
    };

    it('throws an Error if context user is unauthorized', async () => {
      const section = { userId: 'seniorattorney', sectionType: 'potatoes' };
      let error;
      try {
        await getUsersInSection({ section, applicationContext });
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error.message.indexOf('Unauthorized') > -1).toBeTruthy();
    });
  });
});
