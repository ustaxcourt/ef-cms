import { docketClerkCreatesMessageWithCorrespondence } from './journey/docketClerkCreatesMessageWithCorrespondence';
import { docketClerkDeletesCorrespondence } from './journey/docketClerkDeletesCorrespondence';
import { docketClerkViewsMessageWithCorrespondence } from './journey/docketClerkViewsMessageWithCorrespondence';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { userAddsCorrespondence } from './journey/userAddsCorrespondence';
import { userDeletesCorrespondence } from './journey/userDeletesCorrespondence';
import { userEditsCorrespondence } from './journey/userEditsCorrespondence';
import { userNavigatesToAddCorrespondence } from './journey/userNavigatesToAddCorrespondence';
import { userNavigatesToEditCorrespondence } from './journey/userNavigatesToEditCorrespondence';

describe('Adds correspondence to a case', () => {
  const cerebralTest = setupTest();

  const firstCorrespondenceTitle = 'My first correspondence';
  const secondCorrespondenceTitle = 'My second correspondence';

  let caseDetail;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('setup - petitioner creates a case', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('create case', async () => {
      caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });
  });

  describe('docket clerk adds two correspondences and deletes only the first one', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    userNavigatesToAddCorrespondence(cerebralTest, 'DocketClerk');
    userAddsCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} dc`,
      'DocketClerk',
    );
    userAddsCorrespondence(
      cerebralTest,
      `${secondCorrespondenceTitle} dc`,
      'DocketClerk',
    );
    userNavigatesToEditCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} dc`,
      'DocketClerk',
    );
    docketClerkCreatesMessageWithCorrespondence(cerebralTest);
    docketClerkViewsMessageWithCorrespondence(cerebralTest);
    userNavigatesToEditCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} dc`,
      'DocketClerk',
    );
    userEditsCorrespondence(cerebralTest, 'DocketClerk');
    docketClerkDeletesCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} dc`,
    );
  });

  describe('admissions clerk adds one correspondence, edits it, deletes it', () => {
    loginAs(cerebralTest, 'admissionsclerk@example.com');
    userNavigatesToAddCorrespondence(cerebralTest, 'AdmissionsClerk');
    userAddsCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} ac`,
      'AdmissionsClerk',
    );
    userNavigatesToEditCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} ac`,
      'AdmissionsClerk',
    );
    userEditsCorrespondence(cerebralTest, 'AdmissionsClerk');
    userDeletesCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} ac`,
      'AdmissionsClerk',
    );
  });

  describe('general role adds one correspondence, edits it, deletes it', () => {
    loginAs(cerebralTest, 'general@example.com');
    userNavigatesToAddCorrespondence(cerebralTest, 'General user');
    userAddsCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} general`,
      'General user',
    );
    userNavigatesToEditCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} general`,
      'General user',
    );
    userEditsCorrespondence(cerebralTest, 'General user');
    userDeletesCorrespondence(
      cerebralTest,
      `${firstCorrespondenceTitle} general`,
      'General user',
    );
  });
});
