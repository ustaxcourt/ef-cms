import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { admissionsClerkAddsNewPractitioner } from './journey/admissionsClerkAddsNewPractitioner';
import { admissionsClerkEditsPractitionerInfo } from './journey/admissionsClerkEditsPractitionerInfo';
import { admissionsClerkSearchesForPractitionerByBarNumber } from './journey/admissionsClerkSearchesForPractitionerByBarNumber';
import { admissionsClerkSearchesForPractitionersByName } from './journey/admissionsClerkSearchesForPractitionersByName';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';

const test = setupTest();

describe('admissions clerk practitioner journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'admissionsclerk');

  admissionsClerkAddsNewPractitioner(test);
  admissionsClerkSearchesForPractitionersByName(test);
  admissionsClerkSearchesForPractitionerByBarNumber(test);

  loginAs(test, 'petitioner');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: 'domestic',
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });

    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test, true);

  loginAs(test, 'admissionsclerk');
  admissionsClerkEditsPractitionerInfo(test);
});
