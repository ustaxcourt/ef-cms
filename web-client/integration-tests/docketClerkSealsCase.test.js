import { loginAs, setupTest, uploadPetition } from './helpers';

import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { associatedUserAdvancedSearchForSealedCase } from './journey/associatedUserAdvancedSearchForSealedCase';
import { associatedUserViewsCaseDetailForSealedCase } from './journey/associatedUserViewsCaseDetailForSealedCase';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserAdvancedSearchForSealedCase } from './journey/unassociatedUserAdvancedSearchForSealedCase';
import { unassociatedUserViewsCaseDetailForSealedCase } from './journey/unassociatedUserViewsCaseDetailForSealedCase';

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
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'docketclerk');
  docketClerkSealsCase(test);

  //verify that an internal user can still find this case via advanced search by name
  loginAs(test, 'petitionsclerk');
  associatedUserAdvancedSearchForSealedCase(test);

  //associated users
  loginAs(test, 'petitioner');
  associatedUserViewsCaseDetailForSealedCase(test);

  loginAs(test, 'privatePractitioner');
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);

  loginAs(test, 'irsPractitioner');
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);

  //unassociated users
  loginAs(test, 'privatePractitioner3');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);

  loginAs(test, 'irsPractitioner3');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);
});
