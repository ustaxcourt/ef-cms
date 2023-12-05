import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  JUDGE_TITLES,
  ROLES,
} from './EntityConstants';
import { RawUser, User } from './User';

describe('User entity', () => {
  const mockValidUser: RawUser = {
    contact: {
      address1: '234 Main St',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      country: COUNTRY_TYPES.DOMESTIC,
      countryType: COUNTRY_TYPES.DOMESTIC,
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },
    email: 'user@example.com',
    entityName: 'User',
    name: 'Saul Goodman',
    role: ROLES.petitioner,
    userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
  };

  it('should format the user`s phone number', () => {
    const user = new User({
      ...mockValidUser,
      contact: {
        ...mockValidUser.contact,
        phone: '1234567890',
      },
    });

    expect(user.contact!.phone).toEqual('123-456-7890');
  });

  it('should create a user with default role of petitioner when one is not provided', () => {
    const user = new User({
      name: 'Saul Goodman',
      role: undefined,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });

    expect(user.role).toBe(ROLES.petitioner);
  });

  it('should filter out pendingEmailVerificationToken when filtered is true', () => {
    const user = new User(
      {
        ...mockValidUser,
        pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
      },
      { filtered: true },
    );

    expect(user.pendingEmailVerificationToken).toBeUndefined();
  });

  it('should NOT filter out pendingEmailVerificationToken by default when calling userDecorator', () => {
    const user = new User({
      ...mockValidUser,
      pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
    });

    expect(user.pendingEmailVerificationToken).toBeDefined();
  });

  describe('validation', () => {
    it('creates a valid international petitioner user', () => {
      const user = new User({
        ...mockValidUser,
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
      });

      expect(user.isValid()).toBeTruthy();
    });

    it('creates a valid domestic petitioner user', () => {
      const user = new User(mockValidUser);

      expect(user.isValid()).toBeTruthy();
    });

    it('creates a valid petitioner user without address2 or address3', () => {
      const user = new User({
        ...mockValidUser,
        contact: {
          address1: '234 Main St',
          city: 'Chicago',
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
      });

      expect(user.isValid()).toBeTruthy();
    });

    it('creates a valid petitioner user', () => {
      const user = new User({
        name: 'Saul Goodman',
        role: ROLES.petitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      expect(user.isValid()).toBeTruthy();
      expect(user.entityName).toEqual('User');
    });

    it('creates a valid floater user', () => {
      const user = new User({
        name: 'Saul Goodman',
        role: ROLES.floater,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      expect(user.isValid()).toBeTruthy();
      expect(user.entityName).toEqual('User');
    });

    it('creates a valid privatePractitioner user', () => {
      const user = new User({
        barNumber: 'SG101',
        name: 'Saul Goodman',
        role: ROLES.privatePractitioner,
        token: 'abc',
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      expect(user.isValid()).toBeTruthy();
    });

    it('creates a valid irsPractitioner user', () => {
      const user = new User({
        name: 'Saul Goodman',
        role: ROLES.irsPractitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      expect(user.isValid()).toBeTruthy();
    });

    it('creates a valid active judge user', () => {
      const user = new User({
        isSeniorJudge: false,
        judgeFullName: 'Saul Perfectly Goodman',
        judgeTitle: 'Chief Judge',
        name: 'Saul Goodman',
        role: ROLES.judge,
        userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
      });

      expect(user.isValid()).toBeTruthy();
    });

    JUDGE_TITLES.forEach(judgeTitle => {
      it(`should create a valid judge whose title is ${judgeTitle}`, () => {
        const user = new User({
          isSeniorJudge: false,
          judgeFullName: 'Saul Perfectly Goodman',
          judgeTitle,
          name: 'Saul Goodman',
          role: ROLES.judge,
          userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
        });

        expect(user.isValid()).toBeTruthy();
      });
    });

    it('shold be invalid when a judge does not have an isSeniorJudge designator', () => {
      const user = new User({
        isSeniorJudge: undefined,
        judgeFullName: 'Saul Perfectly Goodman',
        judgeTitle: 'Chief Judge',
        name: 'Saul Goodman',
        role: ROLES.judge,
        userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('should be invalid when a judge does not have a judge title', () => {
      const user = new User({
        isSeniorJudge: false,
        judgeFullName: 'Saul Perfectly Goodman',
        name: 'Saul Goodman',
        role: ROLES.judge,
        userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('should be invalid when a judge does not have a judgeFullName', () => {
      const user = new User({
        isSeniorJudge: false,
        judgeTitle: 'Judge',
        name: 'Saul Goodman',
        role: ROLES.judge,
        userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('creates a valid legacy judge user', () => {
      const user = new User({
        isSeniorJudge: false,
        judgeTitle: 'Legacy Chief Judge',
        name: 'Saul Goodman',
        role: ROLES.legacyJudge,
        userId: '5488fed1-1129-4ca0-be7a-3ea3998be953',
      });

      expect(user.isValid()).toBeTruthy();
    });

    it('creates a valid user with a pending email and pendingEmailVerificationToken', () => {
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

    it('creates an invalid user with a pendingEmailVerificationToken that is not a UUID', () => {
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

    it('should return error messages related to the "contact" property', () => {
      const user = new User({
        contact: {},
        name: 'Saul Goodman',
        pendingEmail: 'test@example.com',
        pendingEmailVerificationToken: null,
        role: ROLES.irsPractitioner,
      });

      expect(user.isValid()).toBeFalsy();
      expect(user.getFormattedValidationErrors()).toEqual({
        address1: 'Enter mailing address',
        city: 'Enter city',
        countryType: 'Enter country type',
        phone: 'Enter phone number',
        postalCode: 'Enter ZIP code',
        state: 'Enter state',
        userId: '"userId" is required',
      });
    });
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

    it('should return true when the user role is caseServicesSupervisor', () => {
      expect(User.isInternalUser(ROLES.caseServicesSupervisor)).toEqual(true);
    });
  });

  describe('isCaseServicesUser', () => {
    it(`should return true when the user section is ${CASE_SERVICES_SUPERVISOR_SECTION}`, () => {
      expect(
        User.isCaseServicesUser({ section: CASE_SERVICES_SUPERVISOR_SECTION }),
      ).toBe(true);
    });

    it(`should return false when the user section is NOT ${CASE_SERVICES_SUPERVISOR_SECTION}`, () => {
      expect(User.isCaseServicesUser({ section: DOCKET_SECTION })).toBe(false);
    });
  });

  describe('isChambersUser', () => {
    it('should return true when the user section includes the word chambers', () => {
      const user = new User({ ...mockValidUser, section: "Buch's Chambers" });

      expect(user.isChambersUser()).toBe(true);
    });

    it('should return false when the user section does not include the word chambers', () => {
      const user = new User({ ...mockValidUser, section: DOCKET_SECTION });

      expect(user.isChambersUser()).toBe(false);
    });
  });

  describe('isJudgeUser', () => {
    it('should return true when the user`s role is `judge`', () => {
      const user = new User({ ...mockValidUser, role: ROLES.judge });

      expect(user.isJudgeUser()).toBe(true);
    });

    it('should return false when the user`s role is NOT `judge`', () => {
      const user = new User({ ...mockValidUser, role: ROLES.admissionsClerk });

      expect(user.isJudgeUser()).toBe(false);
    });
  });
});
