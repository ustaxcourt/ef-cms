import { PublicUser } from './PublicUser';

describe('PublicUser entity', () => {
  describe('validation', () => {
    it('fails validation when role is not provided', () => {
      const publicUser = new PublicUser({});

      expect(publicUser.getFormattedValidationErrors()).toMatchObject({
        role: 'Role is required',
      });
    });
  });
});
