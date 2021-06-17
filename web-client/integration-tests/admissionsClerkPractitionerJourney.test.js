import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { admissionsClerkAddsNewPractitioner } from './journey/admissionsClerkAddsNewPractitioner';
import { admissionsClerkAddsPractitionerEmail } from './journey/admissionsClerkAddsPractitionerEmail';
import { admissionsClerkEditsPractitionerInfo } from './journey/admissionsClerkEditsPractitionerInfo';
import { admissionsClerkMigratesPractitionerWithoutEmail } from './journey/admissionsClerkMigratesPractitionerWithoutEmail';
import { admissionsClerkSearchesForPractitionerByBarNumber } from './journey/admissionsClerkSearchesForPractitionerByBarNumber';
import { admissionsClerkSearchesForPractitionersByName } from './journey/admissionsClerkSearchesForPractitionersByName';
import { admissionsClerkVerifiesPractitionerServiceIndicator } from './journey/admissionsClerkVerifiesPractitionerServiceIndicator';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';

const test = setupTest();

describe('admissions clerk practitioner journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkAddsNewPractitioner(test);
  admissionsClerkSearchesForPractitionersByName(test);
  admissionsClerkSearchesForPractitionerByBarNumber(test);

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
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test, true);

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkEditsPractitionerInfo(test);

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

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkMigratesPractitionerWithoutEmail(test);
  admissionsClerkVerifiesPractitionerServiceIndicator(
    test,
    SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test, true);

  it('wait for ES index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(test, 'admissionsclerk@example.com');
  admissionsClerkAddsPractitionerEmail(test);
  admissionsClerkVerifiesPractitionerServiceIndicator(
    test,
    SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
  );

  // show Practitioners only, and not case-users (bug ref: #8081)
  it('searches for indexed Practitioners only and not CaseUser records', async () => {
    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'Buch',
    });

    await test.runSequence('submitPractitionerNameSearchSequence');

    expect(
      test.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.0.name`,
      ),
    ).toEqual('Ronald Buch Jr.');
  });
});
