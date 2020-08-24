import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSealsContactInformation } from './journey/docketClerkSealsContactInformation';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkViewsCaseWithSealedContact } from './journey/petitionsClerkViewsCaseWithSealedContact';
import axios from 'axios';

const test = setupTest();
test.draftOrders = [];
const {
  CHIEF_JUDGE,
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
  STATUS_TYPES,
} = applicationContext.getConstants();

const axiosInstance = axios.create({
  headers: {
    Authorization:
      // mocked admin user
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8',
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

const otherFilersCase = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  caseCaption: 'The Fourth Migrated Case',
  docketNumber: '199-20',
  otherFilers: [
    {
      address1: '42 Lamb Sauce Blvd',
      city: 'Nashville',
      contactId: '46f9ecf7-53d4-43d0-b4ac-8dd340faa219',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'gordonthelambsauce@example.com',
      isAddressSealed: false,
      name: 'Gordon Ramsay',
      otherFilerType: 'Intervenor',
      phone: '1234567890',
      postalCode: '05198',
      state: 'AK',
      title: 'Intervenor',
    },
    {
      address1: '1337 12th Ave',
      city: 'Flavortown',
      contactId: '023c3342-4185-4203-8872-9ad792ec0789',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'mayorflavortown@example.com',
      isAddressSealed: false,
      name: 'Guy Fieri',
      otherFilerType: 'Tax Matters Partner',
      phone: '1234567890',
      postalCode: '05198',
      state: 'AK',
      title: 'Tax Matters Partner',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  status: STATUS_TYPES.calendared,
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

const otherPetitionersCase = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  caseCaption: 'The Fifth Migrated Case',
  docketNumber: '198-20',
  irsPractitioners: [
    {
      barNumber: 'RT6789',
      contact: {
        address1: '982 Oak Boulevard',
        address2: 'Maxime dolorum quae ',
        address3: 'Ut numquam ducimus ',
        city: 'Placeat sed dolorum',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (785) 771-2329',
        postalCode: '17860',
        state: 'LA',
      },
      email: 'someone@example.com',
      hasEAccess: true,
      name: 'Keelie Bruce',
      role: 'irsPractitioner',
      secondaryName: 'Logan Fields',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
    },
  ],
  otherPetitioners: [
    {
      additionalName: 'Test Other Petitioner',
      address1: '982 Oak Boulevard',
      address2: 'Maxime dolorum quae ',
      address3: 'Ut numquam ducimus ',
      city: 'Placeat sed dolorum',
      contactId: 'dd0ac156-aa2d-46e7-8b5a-902f1d16f199',
      countryType: COUNTRY_TYPES.DOMESTIC,
      isAddressSealed: false,
      name: 'Keelie Bruce',
      phone: '+1 (785) 771-2329',
      postalCode: '17860',
      secondaryName: 'Logan Fields',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'LA',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  privatePractitioners: [
    {
      barNumber: 'PT1234',
      contact: {
        address1: '982 Oak Boulevard',
        address2: 'Maxime dolorum quae ',
        address3: 'Ut numquam ducimus ',
        barNumber: 'PT1234',
        city: 'Placeat sed dolorum',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (785) 771-2329',
        postalCode: '17860',
        state: 'LA',
      },
      email: 'someone@example.com',
      hasEAccess: true,
      name: 'Keelie Bruce',
      representing: ['dd0ac156-aa2d-46e7-8b5a-902f1d16f199'],
      role: 'privatePractitioner',
      secondaryName: 'Logan Fields',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      userId: 'd2161b1e-7b85-4f33-b1cc-ff11bca2f819',
    },
  ],
  status: STATUS_TYPES.calendared,
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('Docket Clerk seals a case contact information', () => {
  let contactType;
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTING',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.contactId = caseDetail.contactPrimary.contactId;
  });

  it('should migrate cases', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      otherPetitionersCase,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      otherFilersCase,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(test, 'docketclerk@example.com');
  contactType = 'contactPrimary';
  docketClerkSealsContactInformation(test, contactType);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(test, contactType);

  loginAs(test, 'docketclerk@example.com');
  contactType = 'contactSecondary';
  docketClerkSealsContactInformation(test, contactType);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(test, contactType);

  loginAs(test, 'docketclerk@example.com');
  contactType = 'otherPetitioners';
  docketClerkSealsContactInformation(
    test,
    contactType,
    otherPetitionersCase.docketNumber,
  );

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(
    test,
    contactType,
    otherPetitionersCase.docketNumber,
  );

  loginAs(test, 'docketclerk@example.com');
  contactType = 'otherFilers';
  docketClerkSealsContactInformation(
    test,
    contactType,
    otherFilersCase.docketNumber,
  );

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(
    test,
    contactType,
    otherFilersCase.docketNumber,
  );
});
