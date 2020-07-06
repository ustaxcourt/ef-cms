import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { practitionerFilesDocumentForOwnedCase } from './journey/practitionerFilesDocumentForOwnedCase';
import { practitionerRequestsAccessToCase } from './journey/practitionerRequestsAccessToCase';
import { practitionerRequestsPendingAccessToCase } from './journey/practitionerRequestsPendingAccessToCase';
import { practitionerSearchesForCase } from './journey/practitionerSearchesForCase';
import { practitionerSearchesForNonexistentCase } from './journey/practitionerSearchesForNonexistentCase';
import { practitionerViewsCaseDetail } from './journey/practitionerViewsCaseDetail';
import { practitionerViewsCaseDetailOfOwnedCase } from './journey/practitionerViewsCaseDetailOfOwnedCase';
import { practitionerViewsCaseDetailOfPendingCase } from './journey/practitionerViewsCaseDetailOfPendingCase';
import { practitionerViewsDashboard } from './journey/practitionerViewsDashboard';
import { practitionerViewsDashboardBeforeAddingCase } from './journey/practitionerViewsDashboardBeforeAddingCase';

const test = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Practitioner requests access to case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  //tests for practitioner starting a new case
  loginAs(test, 'privatePractitioner');
  practitionerCreatesNewCase(test, fakeFile);
  practitionerViewsCaseDetailOfOwnedCase(test);

  //tests for practitioner requesting access to existing case
  //petitioner must first create a case for practitioner to request access to
  loginAs(test, 'petitioner');
  it('Create test case #1', async () => {
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

  loginAs(test, 'privatePractitioner');
  practitionerSearchesForNonexistentCase(test);
  practitionerViewsDashboardBeforeAddingCase(test);
  practitionerSearchesForCase(test);
  practitionerViewsCaseDetail(test);
  practitionerRequestsAccessToCase(test, fakeFile);
  practitionerViewsDashboard(test);
  practitionerViewsCaseDetailOfOwnedCase(test);
  practitionerFilesDocumentForOwnedCase(test, fakeFile);

  //tests for practitioner requesting access to existing case
  //petitioner must first create a case for practitioner to request access to
  loginAs(test, 'petitioner');
  it('Create test case #2', async () => {
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

  loginAs(test, 'privatePractitioner');
  practitionerSearchesForCase(test);
  practitionerViewsCaseDetail(test);
  practitionerRequestsPendingAccessToCase(test, fakeFile);
  practitionerViewsCaseDetailOfPendingCase(test);
});
