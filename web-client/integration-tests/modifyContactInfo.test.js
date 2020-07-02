import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkViewsNoticeOfChangeOfAddress } from './journey/docketClerkViewsNoticeOfChangeOfAddress';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerEditsCasePrimaryContactAddressAndPhone } from './journey/petitionerEditsCasePrimaryContactAddressAndPhone';
import { petitionerEditsCasePrimaryContactPhone } from './journey/petitionerEditsCasePrimaryContactPhone';
import { petitionerEditsCaseSecondaryContactAddress } from './journey/petitionerEditsCaseSecondaryContactAddress';
import { petitionerEditsCaseSecondaryContactAddressAndPhone } from './journey/petitionerEditsCaseSecondaryContactAddressAndPhone';
import { petitionerEditsCaseSecondaryContactPhone } from './journey/petitionerEditsCaseSecondaryContactPhone';
import { petitionerNavigatesToEditPrimaryContact } from './journey/petitionerNavigatesToEditPrimaryContact';
import { petitionerNavigatesToEditSecondaryContact } from './journey/petitionerNavigatesToEditSecondaryContact';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

const test = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Modify Petitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  let caseDetail;

  loginAs(test, 'petitioner');
  it('login as a tax payer and create a case', async () => {
    caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Secondary Person',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  petitionerViewsDashboard(test, { caseIndex: 2 });
  petitionerViewsCaseDetail(test, { docketNumberSuffix: 'L' });
  petitionerNavigatesToEditPrimaryContact(test);
  petitionerEditsCasePrimaryContactAddress(test);
  petitionerNavigatesToEditPrimaryContact(test);
  petitionerEditsCasePrimaryContactPhone(test);
  petitionerNavigatesToEditPrimaryContact(test);
  petitionerEditsCasePrimaryContactAddressAndPhone(test);

  // attempt to modify secondary contact information
  loginAs(test, 'petitioner');
  petitionerViewsDashboard(test, { caseIndex: 2 });
  petitionerViewsCaseDetail(test, {
    docketNumberSuffix: 'L',
    documentCount: 5,
  });
  petitionerNavigatesToEditSecondaryContact(test);
  petitionerEditsCaseSecondaryContactAddress(test);
  petitionerNavigatesToEditSecondaryContact(test);
  petitionerEditsCaseSecondaryContactPhone(test);
  petitionerNavigatesToEditSecondaryContact(test);
  petitionerEditsCaseSecondaryContactAddressAndPhone(test);

  loginAs(test, 'docketclerk');
  docketClerkViewsNoticeOfChangeOfAddress(test);
});
