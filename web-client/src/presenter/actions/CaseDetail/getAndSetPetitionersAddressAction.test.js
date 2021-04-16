import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getAndSetPetitionersAddressAction } from './getAndPetitionersAddressAction';
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
              contactId: 'ef907d38-9eca-11eb-a8b3-0242ac130003',
            },
          ],
        },
      },
    });

    expect(result.output).toToEqual({
      screenMetaData: {
        petitionerAddresses: {
          'e8489600-9eca-11eb-a8b3-0242ac130003': '3100 Street street',
        },
      },
    });
  });
});
