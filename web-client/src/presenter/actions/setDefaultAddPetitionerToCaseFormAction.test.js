import { COUNTRY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultAddPetitionerToCaseFormAction } from './setDefaultAddPetitionerToCaseFormAction';

describe('setDefaultAddPetitionerToCaseFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.form with default values', async () => {
    const { state } = await runAction(setDefaultAddPetitionerToCaseFormAction, {
      modules: { presenter },
      state: {
        caseDetail: MOCK_CASE,
      },
    });

    expect(state.form).toEqual({
      contact: {
        caseCaption: MOCK_CASE.caseCaption,
        contactType: undefined,
        countryType: COUNTRY_TYPES.DOMESTIC,
      },
      useExistingAddress: false,
    });
  });
});
