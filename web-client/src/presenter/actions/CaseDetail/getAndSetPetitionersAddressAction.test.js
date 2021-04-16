import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getAndSetPetitionersAddressAction } from './getAndSetPetitionersAddressAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('removeCaseFromTrialAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set petitioner addresses from case on screenMetadata', async () => {
    const result = await runAction(getAndSetPetitionersAddressAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [
            {
              address1: '3100 Street street',
              contactId: 'e8489600-9eca-11eb-a8b3-0242ac130003',
            },
            {
              address1: '3100 Ave street',
              contactId: '5fd05a6a-3742-4de8-935d-b600b2fca9b7',
            },
          ],
        },
      },
    });

    expect(result.state.screenMetadata).toEqual({
      petitionerAddresses: {
        '5fd05a6a-3742-4de8-935d-b600b2fca9b7': '3100 Ave street',
        'e8489600-9eca-11eb-a8b3-0242ac130003': '3100 Street street',
      },
    });
  });
});
