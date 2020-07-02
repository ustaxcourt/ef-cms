const { COUNTRY_TYPES, ROLES } = require('./EntityConstants');
const { User } = require('./User');

describe('User entity', () => {
  it('Creates a valid international petitioner user', () => {
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
      role: ROLES.petitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid domestic petitioner user', () => {
    const user = new User({
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      firstName: 'firstName',
      lastName: 'lastName',
      role: ROLES.petitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid petitioner user without address2 or address3', () => {
    const user = new User({
      contact: {
        address1: '234 Main St',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      firstName: 'firstName',
      lastName: 'lastName',
      role: ROLES.petitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid petitioner user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: ROLES.petitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
    expect(user.entityName).toEqual('User');
  });

  it('Creates a valid privatePractitioner user', () => {
    const user = new User({
      barNumber: 'gg',
      firstName: 'firstName',
      lastName: 'bob',
      role: ROLES.privatePractitioner,
      token: 'abc',
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid irsPractitioner user', () => {
    const user = new User({
      role: ROLES.irsPractitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a user with default role of petitioner if not provided', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'lastName',
      role: undefined,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.role).toBe(ROLES.petitioner);
  });

  describe('isExternalUser', () => {
    it('should return true when the user role is petitioner', () => {
      expect(User.isExternalUser(ROLES.petitioner)).toEqual(true);
    });
    it('should return true when the user role is privatePractitioner', () => {
      expect(User.isExternalUser(ROLES.privatePractitioner)).toEqual(true);
    });
    it('should return true when the user role is irsPractitioner', () => {
      expect(User.isExternalUser(ROLES.irsPractitioner)).toEqual(true);
    });
  });

  describe('isInternalUser', () => {
    it('should return true when the user role is docketclerk', () => {
      expect(User.isInternalUser(ROLES.docketClerk)).toEqual(true);
    });
    it('should return true when the user role is petitionsclerk', () => {
      expect(User.isInternalUser(ROLES.petitionsClerk)).toEqual(true);
    });
    it('should return true when the user role is judge', () => {
      expect(User.isInternalUser(ROLES.judge)).toEqual(true);
    });
    it('should return true when the user role is adc', () => {
      expect(User.isInternalUser(ROLES.adc)).toEqual(true);
    });
    it('should return true when the user role is admissionsclerk', () => {
      expect(User.isInternalUser(ROLES.admissionsClerk)).toEqual(true);
    });
    it('should return true when the user role is chambers', () => {
      expect(User.isInternalUser(ROLES.chambers)).toEqual(true);
    });
    it('should return true when the user role is clerkofcourt', () => {
      expect(User.isInternalUser(ROLES.clerkOfCourt)).toEqual(true);
    });
    it('should return true when the user role is trialclerk', () => {
      expect(User.isInternalUser(ROLES.trialClerk)).toEqual(true);
    });
  });
});
