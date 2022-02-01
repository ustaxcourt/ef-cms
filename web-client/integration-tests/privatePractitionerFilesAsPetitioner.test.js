import { admissionsClerkEditsPetitionerEmail } from './journey/admissionsClerkEditsPetitionerEmail';
import { fakeFile } from '../integration-tests-public/helpers';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkRemovesPractitionerFromCase } from './journey/petitionsClerkRemovesPractitionerFromCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { practitionerViewsDashboard } from './journey/practitionerViewsDashboard';

const cerebralTest = setupTest();

describe('privatePractitioner files as a petitioner', () => {
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

describe('BUG-9323 privatePractitioner remains on case as petitioner after removal', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const privatePractitionerEmail = 'privatePractitioner@example.com';
  const petitionsClerkEmail = 'petitionsclerk@example.com';

  //Order of operations
  //1. Practitioner files petition
  //2. Admissions clerk associates the private practitioner with the petitioner via private practitioner's e-mail
  //3. Any clerk removes privatePractitioner from the case
  //4. Assert that the private practitioner remains the petitioner on the case

  loginAs(privatePractitionerEmail);
  practitionerCreatesNewCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, petitionsClerkEmail);
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkEditsPetitionerEmail(cerebralTest, privatePractitionerEmail);

  loginAs(cerebralTest, petitionsClerkEmail);
  petitionsClerkRemovesPractitionerFromCase(cerebralTest);

  loginAs(privatePractitionerEmail);
  practitionerViewsDashboard(cerebralTest);
});
