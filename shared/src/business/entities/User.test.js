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
      role: User.ROLES.petitioner,
      userId: 'taxpayer',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid domestic taxpayer user', () => {
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
      role: User.ROLES.petitioner,
      userId: 'taxpayer',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid taxpayer user without address2 or address3', () => {
    const user = new User({
      contact: {
        address1: '234 Main St',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      firstName: 'firstName',
      lastName: 'lastName',
      role: User.ROLES.petitioner,
      userId: 'taxpayer',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid petitioner user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: User.ROLES.petitioner,
      userId: 'Tester',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      barNumber: 'gg',
      firstName: 'firstName',
      lastName: 'bob',
      role: User.ROLES.respondent,
      token: 'abc',
      userId: 'Tester',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      role: User.ROLES.respondent,
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
    expect(user.role).toBe(User.ROLES.petitioner);
  });

  describe('isExternalUser', () => {
    it('should return true when the user role is petitioner', () => {
      expect(User.isExternalUser(User.ROLES.petitioner)).toEqual(true);
    });
    it('should return true when the user role is practitioner', () => {
      expect(User.isExternalUser(User.ROLES.practitioner)).toEqual(true);
    });
    it('should return true when the user role is respondent', () => {
      expect(User.isExternalUser(User.ROLES.respondent)).toEqual(true);
    });
  });

  describe('isInternalUser', () => {
    it('should return true when the user role is docketclerk', () => {
      expect(User.isInternalUser(User.ROLES.docketClerk)).toEqual(true);
    });
    it('should return true when the user role is petitionsclerk', () => {
      expect(User.isInternalUser(User.ROLES.petitionsClerk)).toEqual(true);
    });
    it('should return true when the user role is judge', () => {
      expect(User.isInternalUser(User.ROLES.judge)).toEqual(true);
    });
    it('should return true when the user role is seniorattorney', () => {
      expect(User.isInternalUser(User.ROLES.seniorAttorney)).toEqual(true);
    });
  });
});
