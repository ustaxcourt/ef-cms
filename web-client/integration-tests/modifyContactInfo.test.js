import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkViewsNoticeOfChangeOfAddress } from './journey/docketClerkViewsNoticeOfChangeOfAddress';
import { docketClerkViewsQCItemForNCAForUnrepresentedPetitioner } from './journey/docketClerkViewsQCItemForNCAForUnrepresentedPetitioner';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerEditsCasePrimaryContactAddressAndPhone } from './journey/petitionerEditsCasePrimaryContactAddressAndPhone';
import { petitionerEditsCasePrimaryContactPhone } from './journey/petitionerEditsCasePrimaryContactPhone';
import { petitionerNavigatesToEditContact } from './journey/petitionerNavigatesToEditContact';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

const cerebralTest = setupTest();
const { COUNTRY_TYPES, DOCKET_NUMBER_SUFFIXES, PARTY_TYPES } =
  applicationContext.getConstants();

describe('Modify Petitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  let caseDetail;

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a tax payer and create a case', async () => {
    caseDetail = await uploadPetition(cerebralTest, {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  petitionerViewsDashboard(cerebralTest);
  petitionerViewsCaseDetail(cerebralTest, {
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
  });
  petitionerNavigatesToEditContact(cerebralTest);
  petitionerEditsCasePrimaryContactAddress(cerebralTest);
  petitionerNavigatesToEditContact(cerebralTest);
  petitionerEditsCasePrimaryContactPhone(cerebralTest);
  petitionerNavigatesToEditContact(cerebralTest);
  petitionerEditsCasePrimaryContactAddressAndPhone(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsNoticeOfChangeOfAddress(cerebralTest);
  docketClerkViewsQCItemForNCAForUnrepresentedPetitioner(cerebralTest);
});
