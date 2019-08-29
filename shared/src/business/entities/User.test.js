const { User } = require('./User');

describe('User entity', () => {
  it('Creates a valid international taxpayer user', () => {
    const user = new User({
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'petitioner',
      userId: 'taxpayer',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid taxpayer user', () => {
    const user = new User({
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'petitioner',
      userId: 'taxpayer',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid petitioner user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'Tester',
      userId: 'petitioner',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      barNumber: 'gg',
      firstName: 'firstName',
      lastName: 'bob',
      role: 'Tester',
      token: 'abc',
      userId: 'respondent',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      role: 'respondent',
      userId: 'respondent',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a user with default role of petitioner if not provided', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: undefined,
      userId: 'bobbymcgee',
    });
    expect(user.role).toBe('petitioner');
  });

  describe('isExternalUser', () => {
    it('should return true when the user has the role of petitioner', () => {
      const u = new User({ role: 'petitioner' });
      expect(u.isExternalUser()).toEqual(true);
    });
    it('should return true when the user has the role of practitioner', () => {
      const u = new User({ role: 'practitioner' });
      expect(u.isExternalUser()).toEqual(true);
    });
    it('should return true when the user has the role of respondent', () => {
      const u = new User({ role: 'respondent' });
      expect(u.isExternalUser()).toEqual(true);
    });
  });

  describe('isInternalUser', () => {
    it('should return true when the user has the role of docketclerk', () => {
      const u = new User({ role: 'docketclerk' });
      expect(u.isInternalUser()).toEqual(true);
    });
  });
});
