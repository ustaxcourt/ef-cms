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

describe('Bug 9323', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('privatePractitioner files as a petitioner', () => {
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
    const privatePractitionerEmail = 'privatePractitioner@example.com';
    const petitionsClerkEmail = 'petitionsclerk@example.com';

    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerCreatesNewCase(cerebralTest, fakeFile);

    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'admissionsclerk@example.com');
    admissionsClerkEditsPetitionerEmail(cerebralTest, privatePractitionerEmail);

    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkRemovesPractitionerFromCase(cerebralTest);

    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerViewsDashboard(cerebralTest);
  });

  // TODO - Write inverse test of the one directly above
});
