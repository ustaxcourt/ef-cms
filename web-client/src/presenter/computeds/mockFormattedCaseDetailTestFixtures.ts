import { createISODateString } from '@shared/business/utilities/DateHandler';
import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';

export const simpleDocketEntries = [
  {
    createdAt: createISODateString(),
    docketEntryId: '123',
    documentTitle: 'Petition',
    filedBy: 'Jessica Frase Marine',
    filingDate: '2019-02-28T21:14:39.488Z',
    isOnDocketRecord: true,
  },
];

export const mockPetitioners = [
  {
    address1: '734 Cowley Parkway',
    address2: 'Cum aut velit volupt',
    address3: 'Et sunt veritatis ei',
    city: 'Et id aut est velit',
    contactId: '0e891509-4e33-49f6-bb2a-23b327faf6f1',
    contactType: CONTACT_TYPES.primary,
    countryType: 'domestic',
    email: 'petitioner@example.com',
    isAddressSealed: false,
    name: 'Mona Schultz',
    phone: '+1 (884) 358-9729',
    postalCode: '77546',
    sealedAndUnavailable: false,
    serviceIndicator: 'Electronic',
    state: 'CT',
  },
];
