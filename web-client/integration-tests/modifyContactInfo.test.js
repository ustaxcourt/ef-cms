import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkViewsNoticeOfChangeOfAddress } from './journey/docketClerkViewsNoticeOfChangeOfAddress';
import { docketClerkViewsQCItemForNCAForUnrepresentedPetitioner } from './journey/docketClerkViewsQCItemForNCAForUnrepresentedPetitioner';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerEditsCasePrimaryContactAddressAndPhone } from './journey/petitionerEditsCasePrimaryContactAddressAndPhone';
import { petitionerEditsCasePrimaryContactPhone } from './journey/petitionerEditsCasePrimaryContactPhone';
import { petitionerEditsCaseSecondaryContactAddress } from './journey/petitionerEditsCaseSecondaryContactAddress';
import { petitionerEditsCaseSecondaryContactAddressAndPhone } from './journey/petitionerEditsCaseSecondaryContactAddressAndPhone';
import { petitionerEditsCaseSecondaryContactPhone } from './journey/petitionerEditsCaseSecondaryContactPhone';
import { petitionerNavigatesToEditContact } from './journey/petitionerNavigatesToEditContact';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

const test = setupTest();
const {
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} = applicationContext.getConstants();

describe('Modify Petitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;

  loginAs(test, 'petitioner@example.com');
  it('login as a tax payer and create a case', async () => {
    caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        inCareOf: 'Andy Dwyer',
        name: 'Secondary Person',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    expect(caseDetail.privatePractitioners).toEqual([]);
    test.docketNumber = caseDetail.docketNumber;
  });

  petitionerViewsDashboard(test, { caseIndex: 2 });
  petitionerViewsCaseDetail(test, {
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
  });
  petitionerNavigatesToEditContact(test);
  petitionerEditsCasePrimaryContactAddress(test);
  petitionerNavigatesToEditContact(test);
  petitionerEditsCasePrimaryContactPhone(test);
  petitionerNavigatesToEditContact(test);
  petitionerEditsCasePrimaryContactAddressAndPhone(test);

  // attempt to modify secondary contact information
  loginAs(test, 'petitioner@example.com');
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test, {
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
    documentCount: 5,
  });
  petitionerNavigatesToEditContact(test);
  petitionerEditsCaseSecondaryContactAddress(test);
  petitionerNavigatesToEditContact(test);
  petitionerEditsCaseSecondaryContactPhone(test);
  petitionerNavigatesToEditContact(test);
  petitionerEditsCaseSecondaryContactAddressAndPhone(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkViewsNoticeOfChangeOfAddress(test);
  docketClerkViewsQCItemForNCAForUnrepresentedPetitioner(test);
});
