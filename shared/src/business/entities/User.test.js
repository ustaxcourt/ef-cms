const { COUNTRY_TYPES, ROLES } = require('./EntityConstants');
const { User, userDecorator } = require('./User');

describe('User entity', () => {
  it('Creates a valid international petitioner user', () => {
    const user = new User({
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      name: 'Saul Goodman',
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
      name: 'Saul Goodman',
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
      name: 'Saul Goodman',
      role: ROLES.petitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid petitioner user', () => {
    const user = new User({
      name: 'Saul Goodman',
      role: ROLES.petitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
    expect(user.entityName).toEqual('User');
  });

  it('Creates a valid floater user', () => {
    const user = new User({
      name: 'Saul Goodman',
      role: ROLES.floater,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
    expect(user.entityName).toEqual('User');
  });

  it('Creates a valid privatePractitioner user', () => {
    const user = new User({
      barNumber: 'SG101',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      token: 'abc',
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid irsPractitioner user', () => {
    const user = new User({
      name: 'Saul Goodman',
      role: ROLES.irsPractitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid active judge user', () => {
    const user = new User({
      judgeFullName: 'Saul Perfectly Goodman',
      judgeTitle: 'Chief Judge',
      name: 'Saul Goodman',
      role: ROLES.judge,
      userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('is invalid when a judge does not have a judge title', () => {
    const user = new User({
      judgeFullName: 'Saul Perfectly Goodman',
      name: 'Saul Goodman',
      role: ROLES.judge,
      userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('is invalid when a judge does not have a judgeFullName', () => {
    const user = new User({
      judgeTitle: 'Judge',
      name: 'Saul Goodman',
      role: ROLES.judge,
      userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates a valid legacy judge user', () => {
    const user = new User({
      judgeTitle: 'Legacy Chief Judge',
      name: 'Saul Goodman',
      role: ROLES.legacyJudge,
      userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates a valid user with a pending email and pendingEmailVerificationToken', () => {
    const user = new User({
      name: 'Saul Goodman',
      pendingEmail: 'test@example.com',
      pendingEmailVerificationToken: '26dc3fd7-f480-4000-91cc-9fcc565816f1',
      role: ROLES.irsPractitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
    expect(user.pendingEmail).toBeDefined();
    expect(user.pendingEmailVerificationToken).toBeDefined();
  });

  it('Creates an invalid user with a pendingEmailVerificationToken that is not a UUID', () => {
    const user = new User({
      name: 'Saul Goodman',
      pendingEmail: 'test@example.com',
      pendingEmailVerificationToken: 'abc',
      role: ROLES.irsPractitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeFalsy();
    expect(user.getFormattedValidationErrors()).toEqual({
      pendingEmailVerificationToken: expect.anything(),
    });
  });

  it('Creates a user with default role of petitioner if not provided', () => {
    const user = new User({
      name: 'Saul Goodman',
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
    it('should return true when the user role is floater', () => {
      expect(User.isInternalUser(ROLES.floater)).toEqual(true);
    });
    it('should return true when the user role is general', () => {
      expect(User.isInternalUser(ROLES.general)).toEqual(true);
    });
    it('should return true when the user role is reportersOffice', () => {
      expect(User.isInternalUser(ROLES.reportersOffice)).toEqual(true);
    });
  });

  it('should filter out pendingEmailVerificationToken when filtered is true', () => {
    const user = new User(
      {
        contact: {
          address1: '234 Main St',
          city: 'Chicago',
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        name: 'Saul Goodman',
        pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
        role: ROLES.petitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      },
      { filtered: true },
    );
    expect(user.pendingEmailVerificationToken).toBeUndefined();
  });

  it('should NOT filter out pendingEmailVerificationToken by default when calling userDecorator', () => {
    /**
     * constructor - mock user entity to test userDecorator
     */
    function MockUser(rawUser) {
      userDecorator(this, rawUser);
    }

    const user = new MockUser({
      contact: {
        address1: '234 Main St',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      name: 'Saul Goodman',
      pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
      role: ROLES.petitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.pendingEmailVerificationToken).toBeDefined();
  });
});
