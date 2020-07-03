import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { loginAs, setupTest } from './helpers';
import axios from 'axios';

const test = setupTest();

const axiosInstance = axios.create({
  headers: {
    Authorization:
      // mocked admin user
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8',
    'Content-Type': 'application/json',
  },
  timeout: 1000,
});

const {
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
  STATUS_TYPES,
} = applicationContext.getConstants();

const firstConsolidatedCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The First Migrated Case',
  caseId: '384674aa-48b0-4e91-bcb4-915322d4e76b',
  docketNumber: '101-21',
  leadCaseId: '384674aa-48b0-4e91-bcb4-915322d4e76b',
  preferredTrialCity: 'Washington, District of Columbia',
  status: STATUS_TYPES.calendared,
};
const secondConsolidatedCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The Second Migrated Case',
  caseId: '116ff947-48cc-4ee5-9d9a-0bc4e0a64ba3',
  docketNumber: '102-21',
  leadCaseId: '384674aa-48b0-4e91-bcb4-915322d4e76b',
  preferredTrialCity: 'Washington, District of Columbia',
  status: STATUS_TYPES.calendared,
};

const correspondenceCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The Third Migrated Case',
  caseId: 'd2161b1e-7b85-4f33-b1cc-ff11bca2f819',
  correspondence: [
    {
      documentId: '148c2f6f-0e9e-42f3-a73b-b250923d72d9',
      documentTitle: 'Receipt',
      filingDate: '2014-01-14T09:53:55.513-05:00',
      userId: '337d6ccc-0f5f-447d-a688-a925da37f252',
    },
  ],
  docketNumber: '106-15',
  preferredTrialCity: 'Washington, District of Columbia',
  status: STATUS_TYPES.calendared,
};

const otherFilersCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The Fourth Migrated Case',
  caseId: 'd2161b1e-7b85-4f33-b1cc-ff11bca2f819',
  docketNumber: '187-20',
  otherFilers: [
    {
      address1: '42 Lamb Sauce Blvd',
      city: 'Nashville',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'gordon@thelambsauce.com',
      name: 'Gordon Ramsay',
      otherFilerType: 'Intervenor',
      phone: '1234567890',
      postalCode: '05198',
      state: 'AK',
    },
    {
      address1: '1337 12th Ave',
      city: 'Flavortown',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'mayor@flavortown.com',
      name: 'Guy Fieri',
      otherFilerType: 'Participant',
      phone: '1234567890',
      postalCode: '05198',
      state: 'AK',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  status: STATUS_TYPES.calendared,
};

const otherPetitionersCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The Fifth Migrated Case',
  caseId: 'd2161b1e-7b85-4f33-b1cc-ff11bca2f819',
  docketNumber: '162-20',
  otherPetitioners: [
    {
      additionalName: 'Test Other Petitioner',
      address1: '982 Oak Boulevard',
      address2: 'Maxime dolorum quae ',
      address3: 'Ut numquam ducimus ',
      city: 'Placeat sed dolorum',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Keelie Bruce',
      phone: '+1 (785) 771-2329',
      postalCode: '17860',
      secondaryName: 'Logan Fields',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'LA',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  status: STATUS_TYPES.calendared,
};

describe('Case journey', () => {
  it('should migrate cases', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      firstConsolidatedCase,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      secondConsolidatedCase,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      correspondenceCase,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      otherPetitionersCase,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      otherFilersCase,
    );
  });

  loginAs(test, 'docketclerk');

  it('Docketclerk views both consolidated case details', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: firstConsolidatedCase.docketNumber,
    });
    expect(test.getState('caseDetail.consolidatedCases').length).toBe(2);
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: secondConsolidatedCase.docketNumber,
    });
    expect(test.getState('caseDetail.consolidatedCases').length).toBe(2);
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: correspondenceCase.docketNumber,
    });
    expect(test.getState('caseDetail.correspondence').length).toBe(1);
  });
});
