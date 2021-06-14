import { admissionsClerkAddsPractitionerEmail } from './journey/admissionsClerkAddsPractitionerEmail';
import { admissionsClerkMigratesPractitionerWithoutEmail } from './journey/admissionsClerkMigratesPractitionerWithoutEmail';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { partiesInformationHelper as partiesInformationHelperComputed } from '../src/presenter/computeds/partiesInformationHelper';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { practitionerRequestsAccessToCase } from './journey/practitionerRequestsAccessToCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const test = setupTest();

describe('private practitioner views pending email journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);
  petitionsClerkAddsPractitionersToCase(test, false);

  loginAs(test, 'admissionsclerk@example.com');

  //request access to case (aka file a document)
  // verify partiesinfohelper.practitioners pedningemailformatted matches pending email from ealier step

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkMigratesPractitionerWithoutEmail(test); // decide what to do

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test, true);

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkAddsPractitionerEmail(test);

  loginAs(test, 'privatePractitioner@example.com');
  practitionerRequestsAccessToCase(test, fakeFile);

  const partiesInformationHelper = withAppContextDecorator(
    partiesInformationHelperComputed,
  );
});
