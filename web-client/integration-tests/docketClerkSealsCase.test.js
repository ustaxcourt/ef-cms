import { loginAs, setupTest, uploadPetition } from './helpers';

import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import associatedUserAdvancedSearchForSealedCase from './journey/associatedUserAdvancedSearchForSealedCase';
import associatedUserViewsCaseDetailForSealedCase from './journey/associatedUserViewsCaseDetailForSealedCase';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSealsCase from './journey/docketClerkSealsCase';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import petitionerLogIn from './journey/petitionerLogIn';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionsClerkAddsPractitionersToCase from './journey/petitionsClerkAddsPractitionersToCase';
import petitionsClerkAddsRespondentsToCase from './journey/petitionsClerkAddsRespondentsToCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import practitionerLogIn from './journey/practitionerLogIn';
import practitionerSignsOut from './journey/practitionerSignsOut';
import respondentLogIn from './journey/respondentLogIn';
import respondentSignsOut from './journey/respondentSignsOut';
import unassociatedUserAdvancedSearchForSealedCase from './journey/unassociatedUserAdvancedSearchForSealedCase';
import unassociatedUserViewsCaseDetailForSealedCase from './journey/unassociatedUserViewsCaseDetailForSealedCase';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk seals a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'NOTAREALNAMEFORTESTING',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    test.docketNumber = caseDetail.docketNumber;
  });

  petitionsClerkLogIn(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);
  petitionsClerkAddsRespondentsToCase(test);
  petitionsClerkSignsOut(test);

  docketClerkLogIn(test);
  docketClerkSealsCase(test);
  docketClerkSignsOut(test);

  //verify that an internal user can still find this case via advanced search by name
  petitionsClerkLogIn(test);
  associatedUserAdvancedSearchForSealedCase(test);
  petitionsClerkSignsOut(test);

  //associated users
  petitionerLogIn(test);
  associatedUserViewsCaseDetailForSealedCase(test);
  petitionerSignsOut(test);

  practitionerLogIn(test);
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);
  practitionerSignsOut(test);

  respondentLogIn(test);
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);
  respondentSignsOut(test);

  //unassociated users
  practitionerLogIn(test, 'practitioner3');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);
  practitionerSignsOut(test);

  respondentLogIn(test, 'respondent3');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);
  respondentSignsOut(test);
});
