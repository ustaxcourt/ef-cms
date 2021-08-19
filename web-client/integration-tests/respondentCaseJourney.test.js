import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { respondent1ViewsCaseDetailOfAssociatedCase } from './journey/respondent1ViewsCaseDetailOfAssociatedCase';
import { respondentFilesDocumentForAssociatedCase } from './journey/respondentFilesDocumentForAssociatedCase';
import { respondentFilesFirstIRSDocumentOnCase } from './journey/respondentFilesFirstIRSDocumentOnCase';
import { respondentRequestsAccessToCase } from './journey/respondentRequestsAccessToCase';
import { respondentSearchesForCase } from './journey/respondentSearchesForCase';
import { respondentSearchesForNonexistentCase } from './journey/respondentSearchesForNonexistentCase';
import { respondentViewsCaseDetail } from './journey/respondentViewsCaseDetail';
import { respondentViewsCaseDetailOfAssociatedCase } from './journey/respondentViewsCaseDetailOfAssociatedCase';
import { respondentViewsCaseDetailOfUnassociatedCase } from './journey/respondentViewsCaseDetailOfUnassociatedCase';
import { respondentViewsDashboard } from './journey/respondentViewsDashboard';

const cerebralTest = setupTest();

describe('Respondent requests access to a case', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

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

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  respondentSearchesForNonexistentCase(cerebralTest);
  respondentViewsDashboard(cerebralTest);
  respondentSearchesForCase(cerebralTest);
  respondentViewsCaseDetail(cerebralTest, false);
  respondentFilesFirstIRSDocumentOnCase(cerebralTest, fakeFile);
  respondentViewsDashboard(cerebralTest);
  respondentViewsCaseDetailOfAssociatedCase(cerebralTest);
  respondentFilesDocumentForAssociatedCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'irsPractitioner1@example.com');
  respondentSearchesForCase(cerebralTest);
  respondentViewsCaseDetailOfUnassociatedCase(cerebralTest);
  respondentRequestsAccessToCase(cerebralTest, fakeFile);
  respondent1ViewsCaseDetailOfAssociatedCase(cerebralTest);
  respondentFilesDocumentForAssociatedCase(cerebralTest, fakeFile);
});
