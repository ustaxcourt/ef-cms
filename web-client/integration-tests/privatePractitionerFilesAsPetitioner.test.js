import { admissionsClerkEditsPetitionerEmail } from './journey/admissionsClerkEditsPetitionerEmail';
// import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { fakeFile } from '../integration-tests-public/helpers';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const cerebralTest = setupTest();

describe('admissions clerk practitioner journey', () => {
  // const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  //Order of operations
  //1. Petitions clerk creates a petition with no e-mail for the petitioner
  //2. Admissions clerk associates the private practitioner with the petitioner via private practitioner's e-mail
  //3. Admissions clerk assigns the private practitioner to the petitioner on the case.
  //4. Assert that the private practitioner to the petitioner on the case.

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile, undefined, true);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkEditsPetitionerEmail(
    cerebralTest,
    'privatePractitioner@example.com',
  );
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);
});
