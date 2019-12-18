import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkAddsPractitionersToCase from './journey/petitionsClerkAddsPractitionersToCase';
import petitionsClerkAddsRespondentsToCase from './journey/petitionsClerkAddsRespondentsToCase';
import petitionsClerkEditsPractitionerOnCase from './journey/petitionsClerkEditsPractitionerOnCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRemovesPractitionerFromCase from './journey/petitionsClerkRemovesPractitionerFromCase';
import petitionsClerkRemovesRespondentFromCase from './journey/petitionsClerkRemovesRespondentFromCase';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';

const test = setupTest();

describe('Petitions Clerk Counsel Association Journey', () => {
  petitionerLogin(test);
  it('Create test case', async () => {
    await uploadPetition(test, {
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
  });
  petitionerViewsDashboard(test);
  petitionerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);
  petitionsClerkAddsRespondentsToCase(test);
  petitionsClerkEditsPractitionerOnCase(test);
  petitionsClerkRemovesPractitionerFromCase(test);
  petitionsClerkRemovesRespondentFromCase(test);
  petitionsClerkSignsOut(test);
});
