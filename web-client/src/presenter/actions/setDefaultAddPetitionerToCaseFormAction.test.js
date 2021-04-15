import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultAddPetitionerToCaseFormAction } from './setDefaultAddPetitionerToCaseFormAction';

describe('setDefaultAddPetitionerToCaseFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.form with a contact type of secondary if case does not already have a secondary contact', async () => {
    const { state } = await runAction(setDefaultAddPetitionerToCaseFormAction, {
      modules: { presenter },
      state: {
        caseDetail: MOCK_CASE,
      },
    });

    expect(state.form).toEqual({
      caseCaption: MOCK_CASE.caseCaption,
      contact: {
        contactType: CONTACT_TYPES.secondary,
      },
    });
  });

  it('sets state.form with a contact type of otherPetitioner if case already has a secondary contact', async () => {
    const { state } = await runAction(setDefaultAddPetitionerToCaseFormAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          petitioners: [
            ...MOCK_CASE.petitioners,
            {
              ...MOCK_CASE.petitioners[0],
              contactId: '8255eaba-f79f-439d-bc66-4e910acfb5fb',
              contactType: CONTACT_TYPES.secondary,
            },
          ],
        },
      },
    });

    expect(state.form).toEqual({
      caseCaption: MOCK_CASE.caseCaption,
      contact: {
        contactType: CONTACT_TYPES.otherPetitioner,
      },
    });
  });
});
