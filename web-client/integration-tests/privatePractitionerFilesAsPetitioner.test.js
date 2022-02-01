import { admissionsClerkEditsPetitionerEmail } from './journey/admissionsClerkEditsPetitionerEmail';
import { docketClerkAddsPetitionerToCase } from './journey/docketClerkAddsPetitionerToCase';
import { docketClerkRemovesPetitionerFromCase } from './journey/docketClerkRemovesPetitionerFromCase';
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

  const privatePractitionerEmail = 'privatePractitioner@example.com';
  const petitionsClerkEmail = 'petitionsclerk@example.com';
  const docketClerkEmail = 'docketclerk@example.com';

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

  describe('BUG-9323 privatePractitioner remains on case as petitioner after practitioner removal', () => {
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

  describe('BUG-9323 privatePractitioner representing both petitioners remains on case as practitioner after petitioner removal', () => {
    // scenario 1
    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerCreatesNewCase(cerebralTest, fakeFile);

    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'admissionsclerk@example.com');
    admissionsClerkEditsPetitionerEmail(cerebralTest, privatePractitionerEmail);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkRemovesPetitionerFromCase(cerebralTest);

    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerViewsDashboard(cerebralTest);
  });

  describe('BUG-9323 privatePractitioner representing only themselves remains on case as practitioner after second petitioner removal', () => {
    // scenario 2a
    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkCreatesNewCase(cerebralTest, fakeFile);

    loginAs(cerebralTest, docketClerkEmail);
    docketClerkAddsPetitionerToCase(cerebralTest, docketClerkEmail);

    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkAddsPractitionersToCase(cerebralTest, true);

    loginAs(cerebralTest, 'admissionsclerk@example.com');
    admissionsClerkEditsPetitionerEmail(cerebralTest, privatePractitionerEmail);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkRemovesPetitionerFromCase(cerebralTest, true);

    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerViewsDashboard(cerebralTest);
    // TODO: check that practitioner is still _practitioner_ on case
  });
});

//XXXXX 1. represents both petitioners and they are one of those petitioners, doesn't matter which gets deleted = stays associated, stays privatepractioner associated
//2a. represents only themself and not the other petitioner, other petitioner deleted = stays associated, stays privatepractioner associated
//2b. represents only themself and not the other petitioner, themself petitioner deleted = not associated, not privatepractioner associated
//3a. they represent only the other petitioner that isn't themself, other petitioner deleted = stays associated, not privatepractioner associated
//3b. they represent only the other petitioner that isn't themself, themself petitioner deleted = stays associated, stays privatepractioner associated
