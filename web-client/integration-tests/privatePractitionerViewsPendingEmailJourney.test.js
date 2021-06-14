import { admissionsClerkAddsPractitionerEmail } from './journey/admissionsClerkAddsPractitionerEmail';
import { admissionsClerkMigratesPractitionerWithoutEmail } from './journey/admissionsClerkMigratesPractitionerWithoutEmail';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { partiesInformationHelper as partiesInformationHelperComputed } from '../src/presenter/computeds/partiesInformationHelper';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerRequestsAccessToCase } from './journey/practitionerRequestsAccessToCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const test = setupTest();

describe('private practitioner views pending email journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkMigratesPractitionerWithoutEmail(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(test, true);

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkAddsPractitionerEmail(test, true);

  loginAs(test, 'privatePractitioner@example.com');
  practitionerRequestsAccessToCase(test, fakeFile);

  it('unassociated private practitioner views pending email for counsel on case', () => {
    const partiesInformationHelper = withAppContextDecorator(
      partiesInformationHelperComputed,
    );

    const partiesHelper = runCompute(partiesInformationHelper, {
      state: test.getState(),
    });

    const practitionerWithPendingEmail = partiesHelper.formattedPetitioners[0].representingPractitioners.find(
      prac => prac.barNumber === test.barNumber,
    );

    expect(practitionerWithPendingEmail.pendingEmail).toBe(test.pendingEmail);
  });
});
