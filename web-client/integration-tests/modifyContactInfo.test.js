import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { loginAs, setupTest, uploadPetition } from './helpers';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkViewsNoticeOfChangeOfAddress from './journey/docketClerkViewsNoticeOfChangeOfAddress';
import petitionerEditsCasePrimaryContactAddress from './journey/petitionerEditsCasePrimaryContactAddress';
import petitionerEditsCasePrimaryContactAddressAndPhone from './journey/petitionerEditsCasePrimaryContactAddressAndPhone';
import petitionerEditsCasePrimaryContactPhone from './journey/petitionerEditsCasePrimaryContactPhone';
import petitionerEditsCaseSecondaryContactAddress from './journey/petitionerEditsCaseSecondaryContactAddress';
import petitionerEditsCaseSecondaryContactAddressAndPhone from './journey/petitionerEditsCaseSecondaryContactAddressAndPhone';
import petitionerEditsCaseSecondaryContactPhone from './journey/petitionerEditsCaseSecondaryContactPhone';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToEditPrimaryContact from './journey/petitionerNavigatesToEditPrimaryContact';
import petitionerNavigatesToEditSecondaryContact from './journey/petitionerNavigatesToEditSecondaryContact';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';

const test = setupTest();

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
        countryType: 'domestic',
        name: 'Secondary Person',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    test.docketNumber = caseDetail.docketNumber;
  });

  petitionerViewsDashboard(test, { caseIndex: 2 });
  petitionerViewsCaseDetail(test, { docketNumberSuffix: 'L' });
  petitionerNavigatesToEditPrimaryContact(test);
  petitionerEditsCasePrimaryContactAddress(test);
  petitionerEditsCasePrimaryContactPhone(test);
  petitionerEditsCasePrimaryContactAddressAndPhone(test);
  petitionerSignsOut(test);

  // attempt to modify secondary contact information
  petitionerLogin(test);
  petitionerViewsDashboard(test, { caseIndex: 2 });
  petitionerViewsCaseDetail(test, {
    docketNumberSuffix: 'L',
    documentCount: 5,
  });
  petitionerNavigatesToEditSecondaryContact(test);
  petitionerEditsCaseSecondaryContactAddress(test);
  petitionerEditsCaseSecondaryContactPhone(test);
  petitionerEditsCaseSecondaryContactAddressAndPhone(test);
  petitionerSignsOut(test);

  docketClerkLogIn(test);
  docketClerkViewsNoticeOfChangeOfAddress(test);
  docketClerkSignsOut(test);
});
