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
  let caseDetail;

  const test = setupTest();

  const firstCorrespondenceTitle = 'My first correspondence';
  const secondCorrespondenceTitle = 'My second correspondence';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('create case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  userNavigatesToAddCorrespondence(test, 'DocketClerk');
  userAddsCorrespondence(test, firstCorrespondenceTitle, 'DocketClerk');
  userAddsCorrespondence(test, secondCorrespondenceTitle, 'DocketClerk');
  userNavigatesToEditCorrespondence(
    test,
    firstCorrespondenceTitle,
    'DocketClerk',
  );
  docketClerkCreatesMessageWithCorrespondence(test);
  docketClerkViewsMessageWithCorrespondence(test);
  userNavigatesToEditCorrespondence(
    test,
    firstCorrespondenceTitle,
    'DocketClerk',
  );
  userEditsCorrespondence(test, 'DocketClerk');
  docketClerkDeletesCorrespondence(test, firstCorrespondenceTitle);

  loginAs(test, 'admissionsclerk@example.com');
  userNavigatesToAddCorrespondence(test, 'AdmissionsClerk');
  userAddsCorrespondence(test, firstCorrespondenceTitle, 'AdmissionsClerk');
  userNavigatesToEditCorrespondence(
    test,
    firstCorrespondenceTitle,
    'AdmissionsClerk',
  );
  userEditsCorrespondence(test, 'AdmissionsClerk');
  userDeletesCorrespondence(test, firstCorrespondenceTitle, 'AdmissionsClerk');

  loginAs(test, 'general@example.com');
  userNavigatesToAddCorrespondence(test, 'General user');
  userAddsCorrespondence(test, firstCorrespondenceTitle, 'General user');
  userNavigatesToEditCorrespondence(
    test,
    firstCorrespondenceTitle,
    'General user',
  );
  userEditsCorrespondence(test, 'General user');
  userDeletesCorrespondence(test, firstCorrespondenceTitle);
});
