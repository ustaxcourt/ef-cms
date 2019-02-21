const { queryForUsers } = require('./queryForUsers.interactor');
const { UnauthorizedError } = require('../../../errors/errors');

const mockUser = {
  role: 'admin',
};

const expectedSectionUsers = [{ userId: '123' }];
const expectedInternalUsers = [{ userId: 'abc' }];
const applicationContext = {
  getPersistenceGateway: () => {
    return {
      getUsersInSection: () => expectedSectionUsers,
      getInternalUsers: () => expectedInternalUsers,
    };
  },
  getCurrentUser: () => {
    return mockUser;
  },
  environment: { stage: 'local' },
};

describe('queryForUsers', () => {
  describe('getting the users in a section (section as an argument)', () => {
    it('returns the users in a section when the section parameter is defined', async () => {
      mockUser.role = 'docketclerk';
      const results = await queryForUsers({
        section: 'docket',
        applicationContext,
      });
      expect(results).toEqual(expectedSectionUsers);
    });

    it('throws unauthorized when an unauthorized user is provided', async () => {
      mockUser.role = 'petitioner';
      let error;
      try {
        await queryForUsers({
          section: 'docket',
          applicationContext,
        });
      } catch (err) {
        error = err;
      }

      expect(error instanceof UnauthorizedError).toBeTruthy();
    });
  });

  describe('getting the internal users (secton not an argument)', () => {
    it('returns the internal users array when section is not provided', async () => {
      mockUser.role = 'docketclerk';
      const results = await queryForUsers({
        applicationContext,
      });
      expect(results).toEqual(expectedInternalUsers);
    });

    it('throws unauthorized when an unauthorized user is provided', async () => {
      mockUser.role = 'petitioner';
      let error;
      try {
        await queryForUsers({
          applicationContext,
        });
      } catch (err) {
        error = err;
      }

      expect(error instanceof UnauthorizedError).toBeTruthy();
    });
  });
});
