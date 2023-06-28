import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { practitionerSearchesForUnassociatedSealedCase } from './journey/practitionerSearchesForUnassociatedSealedCase';
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

describe('Respondent requests access to a case', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest, {
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

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'irspractitioner@example.com');
  respondentSearchesForNonexistentCase(cerebralTest);
  respondentViewsDashboard(cerebralTest);
  respondentSearchesForCase(cerebralTest);
  respondentViewsCaseDetail(cerebralTest, false);
  respondentFilesFirstIRSDocumentOnCase(cerebralTest, fakeFile);
  respondentViewsDashboard(cerebralTest);
  respondentViewsCaseDetailOfAssociatedCase(cerebralTest);
  respondentFilesDocumentForAssociatedCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'irspractitioner1@example.com');
  respondentSearchesForCase(cerebralTest);
  respondentViewsCaseDetailOfUnassociatedCase(cerebralTest);
  respondentRequestsAccessToCase(cerebralTest, fakeFile);
  respondent1ViewsCaseDetailOfAssociatedCase(cerebralTest);
  respondentFilesDocumentForAssociatedCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'irspractitioner3@example.com');
  practitionerSearchesForUnassociatedSealedCase(cerebralTest);
});
