import { applicationContext } from '../../applicationContext';
import { practitionerDetailHelper as practitionerDetailHelperComputed } from './practitionerDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('practitionerDetailHelper', () => {
  const practitionerDetailHelper = withAppContextDecorator(
    practitionerDetailHelperComputed,
    {
      ...applicationContext,
    },
  );

  it('should fall back to Not provided when additionalPhone is not set', () => {
    const { additionalPhone } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {},
        practitionerDetail: {
          additionalPhone: null,
        },
        user: { role: 'petitioner' },
      },
    });
    expect(additionalPhone).toEqual('Not provided');
  });

  it('should format the admissionsDate', () => {
    const { admissionsDateFormatted } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {},
        practitionerDetail: {
          admissionsDate: '2020-01-27',
        },
        user: { role: 'petitioner' },
      },
    });
    expect(admissionsDateFormatted).toEqual('01/27/2020');
  });

  it('should return practitionerNotes when it exists on state.practitioner detail', () => {
    const mockNote = 'Hi this is a note';

    const { practitionerNotes } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {
          ADD_EDIT_PRACTITIONER_USER: false,
        },
        practitionerDetail: {
          hasEAccess: false,
          practitionerNotes: mockNote,
        },
        user: { role: 'admissionsclerk' },
      },
    });
    expect(practitionerNotes).toEqual(mockNote);
  });

  describe('emailFormatted', () => {
    it('should fall back to Not provided when email is not set', () => {
      const { emailFormatted } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {},
          practitionerDetail: {
            email: null,
          },
          user: { role: 'petitioner' },
        },
      });
      expect(emailFormatted).toEqual('Not provided');
    });

    it('should set emailFormatted to email when the practitioner has a pending email that does not match their current email', () => {
      const mockCurrentEmail = 'notatest@example.com';

      const { emailFormatted } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {},
          practitionerDetail: {
            email: mockCurrentEmail,
            pendingEmail: 'test@example.com',
          },
          user: { role: 'petitioner' },
        },
      });

      expect(emailFormatted).toEqual(mockCurrentEmail);
    });
  });

  describe('pendingEmailFormatted', () => {
    it('should set a pendingEmailFormatted if pendingEmail is set on the user', () => {
      const { pendingEmailFormatted } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
          practitionerDetail: {
            pendingEmail: 'testing@example.com',
          },
          user: { role: 'irsPractitioner' },
        },
      });
      expect(pendingEmailFormatted).toEqual('testing@example.com (Pending)');
    });
  });

  describe('showEditLink', () => {
    it('should show the edit link if the user has ADD_EDIT_PRACTITIONER_USER permission', () => {
      const { showEditLink } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: true,
          },
          practitionerDetail: {
            admissionsDate: '2020-01-27',
          },
          user: { role: 'admissionsclerk' },
        },
      });
      expect(showEditLink).toBeTruthy();
    });

    it('should not show the edit link if the user does not have ADD_EDIT_PRACTITIONER_USER permission', () => {
      const { showEditLink } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
          practitionerDetail: {
            admissionsDate: '2020-01-27',
          },
          user: { role: 'petitioner' },
        },
      });
      expect(showEditLink).toBeFalsy();
    });
  });

  describe('showEAccessFlag', () => {
    it('should show the hasEAccess flag for an internal user', () => {
      const { showEAccessFlag } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
          practitionerDetail: {
            hasEAccess: true,
          },
          user: { role: 'admissionsclerk' },
        },
      });
      expect(showEAccessFlag).toBeTruthy();
    });

    it('should not show the hasEAccess flag for an external user', () => {
      const { showEAccessFlag } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
          practitionerDetail: {
            hasEAccess: true,
          },
          user: { role: 'petitioner' },
        },
      });
      expect(showEAccessFlag).toBeFalsy();
    });

    it('should not show the hasEAccess flag for an internal user when the contact has no eAccess', () => {
      const { showEAccessFlag } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
          practitionerDetail: {
            hasEAccess: false,
          },
          user: { role: 'admissionsclerk' },
        },
      });
      expect(showEAccessFlag).toBeFalsy();
    });
  });

  describe('showPrintCaseListLink', () => {
    it('should show the print case list link if the user is an internal user', () => {
      const { showPrintCaseListLink } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
          practitionerDetail: {
            admissionsDate: '2020-01-27',
          },
          user: { role: 'admissionsclerk' },
        },
      });
      expect(showPrintCaseListLink).toBeTruthy();
    });

    it('should not show the print case list link if the user is an external user', () => {
      const { showPrintCaseListLink } = runCompute(practitionerDetailHelper, {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
          practitionerDetail: {
            admissionsDate: '2020-01-27',
          },
          user: { role: 'irsPractitioner' },
        },
      });
      expect(showPrintCaseListLink).toBeFalsy();
    });
  });
});
