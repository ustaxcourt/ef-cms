import { admissionsClerkEditsPetitionerEmail } from './journey/admissionsClerkEditsPetitionerEmail';
import { docketClerkAddsPetitionerToCase } from './journey/docketClerkAddsPetitionerToCase';
import { docketClerkRemovesPetitionerFromCase } from './journey/docketClerkRemovesPetitionerFromCase';
import { fakeFile } from '../integration-tests-public/helpers';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkRemovesPractitionerFromCase } from './journey/petitionsClerkRemovesPractitionerFromCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { practitionerVerifiesCasePractitionerAssociation } from './journey/practitionerVerifiesCasePractitionerAssociation';
import { practitionerViewsCaseDetail } from './journey/practitionerViewsCaseDetail';
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

  describe('-1 privatePractitioner files as a petitioner', () => {
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

  describe('0 BUG-9323 privatePractitioner remains on case as petitioner after practitioner removal', () => {
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

  describe('1 BUG-9323 privatePractitioner representing both petitioners remains on case as practitioner after petitioner removal', () => {
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

    //fails now (because userCase record removed, casePractitioner record remains aka THE BUG) and pass later
    practitionerViewsDashboard(cerebralTest);
  });

  describe('2a BUG-9323 privatePractitioner representing only themselves remains on case as practitioner after second petitioner removal', () => {
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
    //should pass now and pass later
    practitionerViewsDashboard(cerebralTest);
    practitionerViewsCaseDetail(cerebralTest, false);

    //should pass now and pass later
    practitionerVerifiesCasePractitionerAssociation(cerebralTest, true);
  });

  describe('2b BUG-9323 privatePractitioner representing only themselves remains on case as practitioner after second petitioner removal', () => {
    // scenario 2b
    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkCreatesNewCase(cerebralTest, fakeFile);

    loginAs(cerebralTest, docketClerkEmail);
    docketClerkAddsPetitionerToCase(cerebralTest, docketClerkEmail);

    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkAddsPractitionersToCase(cerebralTest, true);

    loginAs(cerebralTest, 'admissionsclerk@example.com');
    admissionsClerkEditsPetitionerEmail(cerebralTest, privatePractitionerEmail);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkRemovesPetitionerFromCase(cerebralTest, false);

    loginAs(cerebralTest, privatePractitionerEmail);

    //pass now and pass later
    it('Verify case no longer appears on dashboard', async () => {
      await refreshElasticsearchIndex();
      await cerebralTest.runSequence('gotoDashboardSequence');
      expect(cerebralTest.getState('currentPage')).toEqual(
        'DashboardPractitioner',
      );

      const allOpenCases = cerebralTest.getState('openCases');
      expect(allOpenCases).not.toContainEqual(
        expect.objectContaining({ docketNumber: cerebralTest.docketNumber }),
      );
    });

    //pass now and pass later
    practitionerVerifiesCasePractitionerAssociation(cerebralTest, false);
  });

  describe('3a BUG-9323 privatePractitioner representing only the other petitioner remains on case only as petitioner', () => {
    // scenario 3a
    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkCreatesNewCase(cerebralTest, fakeFile);

    loginAs(cerebralTest, docketClerkEmail);
    docketClerkAddsPetitionerToCase(cerebralTest, docketClerkEmail);

    // privatePractitioner is added to case representing primary petitioner
    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkAddsPractitionersToCase(cerebralTest, true);

    // privatePractitioner becomes secondary petitioner
    loginAs(cerebralTest, 'admissionsclerk@example.com');
    admissionsClerkEditsPetitionerEmail(
      cerebralTest,
      privatePractitionerEmail,
      true,
    );

    // remove the primary petitioner from case, secondary petitioner (who is the privatePractitioner) remains
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkRemovesPetitionerFromCase(cerebralTest, false);

    loginAs(cerebralTest, privatePractitionerEmail);

    //fail now and pass later
    practitionerViewsDashboard(cerebralTest);

    // pass now and pass later
    practitionerVerifiesCasePractitionerAssociation(cerebralTest, false);
  });

  describe('3b BUG-9323 privatePractitioner representing only the other petitioner remains on case only as practitioner', () => {
    //they represent only the other petitioner that isn't themself, themself petitioner deleted = stays associated, stays privatepractioner associated
    // scenario 3b
    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkCreatesNewCase(cerebralTest, fakeFile);

    loginAs(cerebralTest, docketClerkEmail);
    docketClerkAddsPetitionerToCase(cerebralTest, docketClerkEmail);

    // privatePractitioner is added to case representing primary petitioner
    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkAddsPractitionersToCase(cerebralTest, true);

    // privatePractitioner becomes secondary petitioner
    loginAs(cerebralTest, 'admissionsclerk@example.com');
    admissionsClerkEditsPetitionerEmail(
      cerebralTest,
      privatePractitionerEmail,
      true,
    );

    // remove the secondary petitioner (who is the privatePractitioner) from case, primary petitioner remains
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkRemovesPetitionerFromCase(cerebralTest, true);

    // should fail now, pass later
    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerViewsDashboard(cerebralTest);

    //should pass now, pass later
    practitionerVerifiesCasePractitionerAssociation(cerebralTest, true);
  });
});

//XXXXX 1. represents both petitioners and they are one of those petitioners, doesn't matter which gets deleted = stays associated, stays privatepractioner associated
//         - Is the second petitioner also respresented by the practitioner who filed the case
//XXXXX 2a. represents only themself and not the other petitioner, other petitioner deleted = stays associated, stays privatepractioner associated
//XXXXX2b. represents only themself and not the other petitioner, themself petitioner deleted = not associated, not privatepractioner associated
//XXXXX3a. they represent only the other petitioner that isn't themself, other petitioner deleted = stays associated, not privatepractioner associated
//XXXXX3b. they represent only the other petitioner that isn't themself, themself petitioner deleted = stays associated, stays privatepractioner associated
// TODO:  Should we reconsider checking to see whether practitioner remains on petitioner array on caseDetail instead of just checking the dashboard
