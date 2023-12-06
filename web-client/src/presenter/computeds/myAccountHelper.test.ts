import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { myAccountHelper as myAccountHelperComputed } from './myAccountHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const { USER_ROLES } = applicationContext.getConstants();

let user = {
  role: USER_ROLES.petitioner,
};

const myAccountHelper = withAppContextDecorator(myAccountHelperComputed, {
  ...applicationContext,
  getCurrentUser: () => user,
});

describe('myAccountHelper', () => {
  describe('showMyContactInformation', () => {
    it('should be true when the current user is a private practitioner', () => {
      user.role = USER_ROLES.privatePractitioner;

      const { showMyContactInformation } = runCompute(myAccountHelper, {});

      expect(showMyContactInformation).toBeTruthy();
    });

    it('should be true when the current user is an IRS practitioner', () => {
      user.role = USER_ROLES.irsPractitioner;

      const { showMyContactInformation } = runCompute(myAccountHelper, {});

      expect(showMyContactInformation).toBeTruthy();
    });

    it('should be false when the current user is NOT a practitioner', () => {
      user.role = USER_ROLES.petitioner;

      const { showMyContactInformation } = runCompute(myAccountHelper, {});

      expect(showMyContactInformation).toBeFalsy();
    });
  });

  describe('showPetitionerView', () => {
    it('should be true when the current user is a petitioner', () => {
      user.role = USER_ROLES.petitioner;

      const { showPetitionerView } = runCompute(myAccountHelper, {});

      expect(showPetitionerView).toBeTruthy();
    });

    it('should be true when the current user is NOT a petitioner', () => {
      user.role = USER_ROLES.irsPractitioner;

      const { showPetitionerView } = runCompute(myAccountHelper, {});

      expect(showPetitionerView).toBeFalsy();
    });
  });
});
