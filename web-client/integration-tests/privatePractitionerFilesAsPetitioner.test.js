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
    practitionerViewsCaseDetail(cerebralTest, false);

    it('Check practitioner can still practice law stuff on this case', () => {
      const privatePractitioners = cerebralTest.getState(
        'caseDetail.privatePractitioners',
      );

      const currentUser = cerebralTest.getState('user');

      expect(privatePractitioners).toContainEqual(
        expect.objectContaining({ userId: currentUser.userId }),
      );
    });
  });

  describe('BUG-9323 privatePractitioner representing only themselves remains on case as practitioner after second petitioner removal', () => {
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

    it('Verify that practitioner cannot practice law stuff on the case anymore', () => {
      const privatePractitioners = cerebralTest.getState(
        'caseDetail.privatePractitioners',
      );
      const currentUser = cerebralTest.getState('user');

      expect(privatePractitioners).not.toContainEqual(
        expect.objectContaining({ userId: currentUser.userId }),
      );
    });
  });
});

//XXXXX 1. represents both petitioners and they are one of those petitioners, doesn't matter which gets deleted = stays associated, stays privatepractioner associated
//         - Is the second petitioner also respresented by the practitioner who filed the case
//XXXXX 2a. represents only themself and not the other petitioner, other petitioner deleted = stays associated, stays privatepractioner associated
//2b. represents only themself and not the other petitioner, themself petitioner deleted = not associated, not privatepractioner associated
//3a. they represent only the other petitioner that isn't themself, other petitioner deleted = stays associated, not privatepractioner associated
//3b. they represent only the other petitioner that isn't themself, themself petitioner deleted = stays associated, stays privatepractioner associated
