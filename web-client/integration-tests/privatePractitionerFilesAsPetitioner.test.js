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
  // This suite covers the changes made to address BUG 9323; removing checks around practitioner users becoming petitioners on a case
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
    // Practitioner represents both petitioners and IS one of those petitioners, doesn't matter which gets deleted: Practitioner stays associated to case, Practitioner remains a privatePractioner on case
    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerCreatesNewCase(cerebralTest, fakeFile);

    loginAs(cerebralTest, petitionsClerkEmail);
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'admissionsclerk@example.com');
    admissionsClerkEditsPetitionerEmail(cerebralTest, privatePractitionerEmail);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkRemovesPetitionerFromCase(cerebralTest);

    loginAs(cerebralTest, privatePractitionerEmail);

    //would have failed prior to refactor
    practitionerViewsDashboard(cerebralTest);
  });

  describe('BUG-9323 privatePractitioner representing only themselves remains on case as practitioner after second petitioner removal', () => {
    // Practitioner is also a petitioner on case, represents only themselves and not the other petitioner, other petitioner is deleted; Practitioner stays associated to case, Practitioner remains a privatePractitioner on case
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
    practitionerViewsCaseDetail(cerebralTest, false);

    practitionerVerifiesCasePractitionerAssociation(cerebralTest, true);
  });

  describe('BUG-9323 privatePractitioner representing only themselves remains on case as practitioner after second petitioner removal', () => {
    // Practitioner is also a petitioner on case, represents only themselves and not the other petitioner, Practitioner is deleted as petitioner; Practitioner case association is removed, Practitioner is removed as privatePractitioner on case
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
    practitionerVerifiesCasePractitionerAssociation(cerebralTest, false);
  });

  describe('BUG-9323 privatePractitioner representing only the other petitioner remains on case only as petitioner', () => {
    // Practitioner is also a petitioner on case, represents only themselves and not the other petitioner, other petitioner is deleted; Practitioner stays associated to case, Practitioner is removed as privatePractitioner on case
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

    // would have failed prior to refactor
    practitionerViewsDashboard(cerebralTest);
    practitionerVerifiesCasePractitionerAssociation(cerebralTest, false);
  });

  describe('BUG-9323 privatePractitioner representing only the other petitioner remains on case only as practitioner', () => {
    // Practitioner is also a petitioner on case, represents only themselves and not the other petitioner, Practitioner is deleted as petitioner; Practitioner stays associated to case, Practitioner is removed as privatePractitioner on case
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

    // would have failed prior to refactor
    loginAs(cerebralTest, privatePractitionerEmail);
    practitionerViewsDashboard(cerebralTest);
    practitionerVerifiesCasePractitionerAssociation(cerebralTest, true);
  });
});
