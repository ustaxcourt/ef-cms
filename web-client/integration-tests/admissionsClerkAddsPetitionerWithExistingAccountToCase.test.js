import { admissionsClerkEditsPetitionerEmail } from './journey/admissionsClerkEditsPetitionerEmail';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const cerebralTest = setupTest();

describe('admissions clerk adds petitioner with existing cognito account to case', () => {
  const EMAIL_TO_ADD = 'petitioner2@example.com';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile);
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkEditsPetitionerEmail(cerebralTest, EMAIL_TO_ADD);

  loginAs(cerebralTest, 'petitioner2@example.com');
  it('petitioner with existing account verifies case is added to dashboard', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardPetitioner');
    const openCases = cerebralTest.getState('openCases');

    const addedCase = openCases.find(
      c => c.docketNumber === cerebralTest.docketNumber,
    );
    expect(addedCase).toBeDefined();

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    expect(cerebralTest.getState('screenMetadata.isAssociated')).toEqual(true);
  });

  it('should verify that practitioner representing contactId matches contactPrimary contactId after email is updated', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    const practitionerRepresenting = cerebralTest.getState(
      'caseDetail.privatePractitioners.0.representing',
    );

    expect(practitionerRepresenting).toEqual([contactPrimary.contactId]);
  });
});
