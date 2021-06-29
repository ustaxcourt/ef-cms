import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService } from './journey/docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService';
import { docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner } from './journey/docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkQCsNCAForCaseWithPaperService } from './journey/docketClerkQCsNCAForCaseWithPaperService';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerNavigatesToEditContact } from './journey/petitionerNavigatesToEditContact';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';

const test = setupTest();
test.draftOrders = [];

describe('noticeOfChangeOfAddressQCJourney', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    expect(caseDetail.privatePractitioners).toEqual([]);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);
  petitionsClerkAddsPractitionersToCase(test);

  loginAs(test, 'petitioner@example.com');
  petitionerNavigatesToEditContact(test);
  petitionerEditsCasePrimaryContactAddress(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner(test);

  loginAs(test, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService(test);
  docketClerkEditsServiceIndicatorForPetitioner(test);

  loginAs(test, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkQCsNCAForCaseWithPaperService(test);
});
