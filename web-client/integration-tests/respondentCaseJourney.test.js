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

const test = setupTest();

describe('Respondent requests access to a case', () => {
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

  loginAs(test, 'irsPractitioner@example.com');
  respondentSearchesForNonexistentCase(test);
  respondentViewsDashboard(test);
  respondentSearchesForCase(test);
  respondentViewsCaseDetail(test, false);
  respondentFilesFirstIRSDocumentOnCase(test, fakeFile);
  respondentViewsDashboard(test);
  respondentViewsCaseDetailOfAssociatedCase(test);
  respondentFilesDocumentForAssociatedCase(test, fakeFile);

  loginAs(test, 'irsPractitioner1@example.com');
  respondentSearchesForCase(test);
  respondentViewsCaseDetailOfUnassociatedCase(test);
  respondentRequestsAccessToCase(test, fakeFile);
  respondent1ViewsCaseDetailOfAssociatedCase(test);
  respondentFilesDocumentForAssociatedCase(test, fakeFile);
});
