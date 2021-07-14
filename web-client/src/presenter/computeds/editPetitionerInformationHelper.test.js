import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { editPetitionerInformationHelper as editPetitionerInformationHelperComputed } from './editPetitionerInformationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const editPetitionerInformationHelper = withAppContextDecorator(
  editPetitionerInformationHelperComputed,
  applicationContext,
);

describe('editPetitionerInformationHelper', () => {
  it('returns showEditEmail true if the current user has the EDIT_PETITIONER_EMAIL permission and state.screenMetadata.userPendingEmail is undefined', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: { petitioners: [{}, {}] },
        form: { contact: {} },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
        screenMetadata: {
          userPendingEmail: undefined,
        },
      },
    });
    expect(result.showEditEmail).toEqual(true);
  });

  it('returns showEditEmail false if the current user DOES NOT have the EDIT_PETITIONER_EMAIL permission', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: { petitioners: [{}, {}] },
        form: { contact: {} },
        permissions: {
          EDIT_PETITIONER_EMAIL: false,
        },
      },
    });
    expect(result.showEditEmail).toEqual(false);
  });

  it('returns showEditEmail false if the current user DOES have the EDIT_PETITIONER_EMAIL permission but state.screenMetadata.userPendingEmail is defined', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: { petitioners: [{}, {}] },
        form: { contact: {} },
        permissions: {
          EDIT_PETITIONER_EMAIL: false,
        },
        screenMetadata: {
          userPendingEmail: 'error@example.com',
        },
      },
    });
    expect(result.showEditEmail).toEqual(false);
  });

  it('returns userPendingEmail from state', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: { petitioners: [{}, {}] },
        form: { contact: {} },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
        screenMetadata: { userPendingEmail: 'email@example.com' },
      },
    });
    expect(result.userPendingEmail).toEqual('email@example.com');
  });

  describe('showRemovePetitionerButton', () => {
    it('is false when the current user does not have permission to edit petitioners', () => {
      const result = runCompute(editPetitionerInformationHelper, {
        state: {
          caseDetail: {
            petitioners: [
              {
                contactType: CONTACT_TYPES.petitioner,
              },
              {
                contactType: CONTACT_TYPES.petitioner,
              },
            ],
          },
          form: {
            contact: {
              contactType: CONTACT_TYPES.petitioner,
            },
          },
          permissions: {
            REMOVE_PETITIONER: false,
          },
        },
      });
      expect(result.showRemovePetitionerButton).toBeFalsy();
    });

    it('is true when there is more than one petitioner contact type on the case and form.contact.contactType is petitioner', () => {
      const result = runCompute(editPetitionerInformationHelper, {
        state: {
          caseDetail: {
            petitioners: [
              {
                contactType: CONTACT_TYPES.petitioner,
              },
              {
                contactType: CONTACT_TYPES.petitioner,
              },
            ],
          },
          form: {
            contact: {
              contactType: CONTACT_TYPES.petitioner,
            },
          },
          permissions: {
            REMOVE_PETITIONER: true,
          },
        },
      });
      expect(result.showRemovePetitionerButton).toBeTruthy();
    });

    it('is false when there is only one petitioner contact type on the case and form.contact.contactType is petitioner', () => {
      const result = runCompute(editPetitionerInformationHelper, {
        state: {
          caseDetail: {
            petitioners: [
              {
                contactType: CONTACT_TYPES.petitioner,
              },
              {
                contactType: CONTACT_TYPES.intervenor,
              },
            ],
          },
          form: {
            contact: {
              contactType: CONTACT_TYPES.petitioner,
            },
          },
          permissions: {
            REMOVE_PETITIONER: true,
          },
        },
      });
      expect(result.showRemovePetitionerButton).toBeFalsy();
    });

    it('is true when the form.contact.contactType is a participant or intervenor', () => {
      const result = runCompute(editPetitionerInformationHelper, {
        state: {
          caseDetail: {
            petitioners: [
              {
                contactType: CONTACT_TYPES.petitioner,
              },
              {
                contactType: CONTACT_TYPES.intervenor,
              },
            ],
          },
          form: {
            contact: {
              contactType: CONTACT_TYPES.intervenor,
            },
          },
          permissions: {
            REMOVE_PETITIONER: true,
          },
        },
      });
      expect(result.showRemovePetitionerButton).toBeTruthy();
    });
  });

  it('returns showSealAddress true if the current user has the SEAL_ADDRESS permission', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: { petitioners: [{}, {}] },
        form: { contact: {} },
        permissions: {
          SEAL_ADDRESS: true,
        },
      },
    });
    expect(result.showSealAddress).toEqual(true);
  });

  it('returns showSealAddress false if the current user DOES NOT have the SEAL_ADDRESS permission', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: { petitioners: [{}, {}] },
        form: { contact: {} },
        permissions: {
          SEAL_ADDRESS: false,
        },
      },
    });
    expect(result.showSealAddress).toEqual(false);
  });

  describe('showIntervenorRole', () => {
    const intervenor = {
      contactId: '629a1b15-f1d3-4722-a5ed-4582cae9cfd9',
      contactType: CONTACT_TYPES.intervenor,
    };
    const petitioner = {
      contactId: '1166241d-dd73-42e5-aadf-43db509e6b1b',
      contactType: CONTACT_TYPES.petitioner,
    };
    it('should be true when the only intervenor on the case is the petitioner being edited', () => {
      const { showIntervenorRole } = runCompute(
        editPetitionerInformationHelper,
        {
          state: {
            caseDetail: {
              petitioners: [petitioner, intervenor],
            },
            form: {
              contact: {
                ...intervenor,
              },
            },
            permissions: {},
          },
        },
      );

      expect(showIntervenorRole).toBeTruthy();
    });

    it('should be false when there is an intervenor who is not the petitioner being edited', () => {
      const { showIntervenorRole } = runCompute(
        editPetitionerInformationHelper,
        {
          state: {
            caseDetail: {
              petitioners: [petitioner, intervenor],
            },
            form: {
              contact: {
                ...petitioner,
              },
            },
            permissions: {},
          },
        },
      );

      expect(showIntervenorRole).toBeFalsy();
    });
  });
});
