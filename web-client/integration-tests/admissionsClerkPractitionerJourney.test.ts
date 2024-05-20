import {
  ADVANCED_SEARCH_TABS,
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { admissionsClerkAddsNewPractitioner } from './journey/admissionsClerkAddsNewPractitioner';
import { admissionsClerkAddsPractitionerEmail } from './journey/admissionsClerkAddsPractitionerEmail';
import { admissionsClerkEditsPractitionerInfo } from './journey/admissionsClerkEditsPractitionerInfo';
import { admissionsClerkMigratesPractitionerWithoutEmail } from './journey/admissionsClerkMigratesPractitionerWithoutEmail';
import { admissionsClerkSearchesForPractitionerByBarNumber } from './journey/admissionsClerkSearchesForPractitionerByBarNumber';
import { admissionsClerkVerifiesPractitionerServiceIndicator } from './journey/admissionsClerkVerifiesPractitionerServiceIndicator';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';

describe('admissions clerk practitioner journey', () => {
  const cerebralTest = setupTest({
    constantsOverrides: {
      CASE_SEARCH_PAGE_SIZE: 1,
    },
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkAddsNewPractitioner(cerebralTest);
  admissionsClerkSearchesForPractitionerByBarNumber(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkEditsPractitionerInfo(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkMigratesPractitionerWithoutEmail(cerebralTest);
  admissionsClerkVerifiesPractitionerServiceIndicator(
    cerebralTest,
    SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  it('wait for ES index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkAddsPractitionerEmail(cerebralTest);

  it('searches for indexed Practitioners only and not CaseUser records', async () => {
    await cerebralTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'Buch',
    });

    await cerebralTest.runSequence('submitPractitionerNameSearchSequence');

    expect(
      cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.practitioners.0.name`,
      ),
    ).toEqual('Ronald Buch Jr.');
  });
});
