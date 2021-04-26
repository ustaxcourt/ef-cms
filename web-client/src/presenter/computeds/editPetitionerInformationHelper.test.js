import {
  CONTACT_TYPES,
  PARTY_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
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
        caseDetail: {},
        form: { partyType: PARTY_TYPES.petitioner },
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
        caseDetail: {},
        form: { partyType: PARTY_TYPES.petitioner },
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
        caseDetail: {},
        form: { partyType: PARTY_TYPES.petitioner },
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

  it('should return contactPrimaryHasEmail true if the contactPrimary has an email address', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: {
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              email: 'testpetitioner@example.com',
            },
          ],
        },
        form: {
          contactPrimary: {
            email: 'testpetitioner@example.com',
          },
          partyType: PARTY_TYPES.petitioner,
        },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });

    expect(result.contactPrimaryHasEmail).toEqual(true);
  });

  it('should return contactPrimaryHasEmail false if the contactPrimary DOES NOT have an email address', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: {
          petitioners: [],
        },
        form: {
          contactPrimary: {},
          partyType: PARTY_TYPES.petitioner,
        },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });

    expect(result.contactPrimaryHasEmail).toEqual(false);
  });

  it('returns userPendingEmail from state', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        caseDetail: {},
        form: { partyType: PARTY_TYPES.petitioner },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
        screenMetadata: { userPendingEmail: 'email@example.com' },
      },
    });
    expect(result.userPendingEmail).toEqual('email@example.com');
  });
});
