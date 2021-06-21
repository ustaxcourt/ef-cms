import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getAndSetPetitionersAddressAction } from './getAndSetPetitionersAddressAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getAndSetPetitionersAddressAction', () => {
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

  it('should set petitioner addresses 1, 2, and 3 from case on screenMetadata if they exist', async () => {
    const result = await runAction(getAndSetPetitionersAddressAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [
            {
              address1: '3100 Street street',
              address2: 'Suite 3',
              address3: 'Room 7',
              contactId: 'e8489600-9eca-11eb-a8b3-0242ac130003',
            },
            {
              address1: '3100 Ave street',
              address2: 'Suite 4',
              address3: 'Room 8',
              contactId: '5fd05a6a-3742-4de8-935d-b600b2fca9b7',
            },
          ],
        },
      },
    });

    expect(result.state.screenMetadata).toEqual({
      petitionerAddresses: {
        '5fd05a6a-3742-4de8-935d-b600b2fca9b7':
          '3100 Ave street, Suite 4, Room 8',
        'e8489600-9eca-11eb-a8b3-0242ac130003':
          '3100 Street street, Suite 3, Room 7',
      },
    });
  });

  it('should only set unique petitioner addresses from case on screenMetadata', async () => {
    const result = await runAction(getAndSetPetitionersAddressAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [
            {
              address1: '3100 Street street',
              address2: 'Suite 3',
              address3: 'Room 7',
              contactId: 'e8489600-9eca-11eb-a8b3-0242ac130003',
            },
            {
              address1: '3100 Street street',
              address2: 'Suite 3',
              address3: 'Room 7',
              contactId: '5fd05a6a-3742-4de8-935d-b600b2fca9b7',
            },
            {
              address1: '3298 Street street',
              address2: 'Suite 978',
              address3: 'Room 000',
              contactId: '6c7a15ac-5c18-43d1-b35d-5544bf1648da',
            },
          ],
        },
      },
    });

    expect(result.state.screenMetadata).toEqual({
      petitionerAddresses: {
        '6c7a15ac-5c18-43d1-b35d-5544bf1648da':
          '3298 Street street, Suite 978, Room 000',
        'e8489600-9eca-11eb-a8b3-0242ac130003':
          '3100 Street street, Suite 3, Room 7',
      },
    });
  });
});
