import {
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkViewsNoticeOfChangeOfAddress } from './journey/docketClerkViewsNoticeOfChangeOfAddress';
import { docketClerkViewsQCItemForNCAForUnrepresentedPetitioner } from './journey/docketClerkViewsQCItemForNCAForUnrepresentedPetitioner';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerEditsCasePrimaryContactAddressAndPhone } from './journey/petitionerEditsCasePrimaryContactAddressAndPhone';
import { petitionerEditsCasePrimaryContactPhone } from './journey/petitionerEditsCasePrimaryContactPhone';
import { petitionerNavigatesToEditContact } from './journey/petitionerNavigatesToEditContact';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

describe('Modify Petitioner Contact Information', () => {
  const cerebralTest = setupTest();

  let caseDetail;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

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

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerNavigatesToEditContact(cerebralTest);
  petitionerEditsCasePrimaryContactAddress(cerebralTest);
  petitionerNavigatesToEditContact(cerebralTest);
  petitionerEditsCasePrimaryContactPhone(cerebralTest);
  petitionerNavigatesToEditContact(cerebralTest);
  petitionerEditsCasePrimaryContactAddressAndPhone(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsNoticeOfChangeOfAddress({ cerebralTest });
  docketClerkViewsQCItemForNCAForUnrepresentedPetitioner(cerebralTest);
});
