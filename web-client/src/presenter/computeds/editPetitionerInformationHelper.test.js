import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { editPetitionerInformationHelper as editPetitionerInformationHelperComputed } from './editPetitionerInformationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const editPetitionerInformationHelper = withAppContextDecorator(
  editPetitionerInformationHelperComputed,
  applicationContext,
);

describe('editPetitionerInformationHelper', () => {
  it('returns showLoginAndServiceInformation true if the current user has the EDIT_PETITIONER_EMAIL permission', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: { partyType: PARTY_TYPES.petitioner },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });
    expect(result.showLoginAndServiceInformation).toEqual(true);
  });
  it('returns showLoginAndServiceInformation false if the current user DOES NOT have the EDIT_PETITIONER_EMAIL permission', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: { partyType: PARTY_TYPES.petitioner },
        permissions: {
          EDIT_PETITIONER_EMAIL: false,
        },
      },
    });
    expect(result.showLoginAndServiceInformation).toEqual(false);
  });
  // TODO additional coverage
});
