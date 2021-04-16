import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setSelectedPetitionerAddressAction } from './setSelectedPetitionerAddressAction';

describe('setSelectedPetitionerAddressAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should populate petitioner addresses from case on add petitioner form', async () => {
    const result = await runAction(setSelectedPetitionerAddressAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          ...MOCK_CASE,
        },
      },
    });

    expect(result.state.form.contact).toEqual({});
  });
});
