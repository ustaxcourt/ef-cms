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

  it('sets state.form with a contact type of otherPetitioner', async () => {
    const { state } = await runAction(setDefaultAddPetitionerToCaseFormAction, {
      modules: { presenter },
      state: {
        caseDetail: MOCK_CASE,
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
