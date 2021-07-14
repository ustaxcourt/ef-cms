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

  const cerebralTest = setupTest();

  const firstCorrespondenceTitle = 'My first correspondence';
  const secondCorrespondenceTitle = 'My second correspondence';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case', async () => {
    caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  userNavigatesToAddCorrespondence(cerebralTest, 'DocketClerk');
  userAddsCorrespondence(cerebralTest, firstCorrespondenceTitle, 'DocketClerk');
  userAddsCorrespondence(
    cerebralTest,
    secondCorrespondenceTitle,
    'DocketClerk',
  );
  userNavigatesToEditCorrespondence(
    cerebralTest,
    firstCorrespondenceTitle,
    'DocketClerk',
  );
  docketClerkCreatesMessageWithCorrespondence(cerebralTest);
  docketClerkViewsMessageWithCorrespondence(cerebralTest);
  userNavigatesToEditCorrespondence(
    cerebralTest,
    firstCorrespondenceTitle,
    'DocketClerk',
  );
  userEditsCorrespondence(cerebralTest, 'DocketClerk');
  docketClerkDeletesCorrespondence(cerebralTest, firstCorrespondenceTitle);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  userNavigatesToAddCorrespondence(cerebralTest, 'AdmissionsClerk');
  userAddsCorrespondence(
    cerebralTest,
    firstCorrespondenceTitle,
    'AdmissionsClerk',
  );
  userNavigatesToEditCorrespondence(
    cerebralTest,
    firstCorrespondenceTitle,
    'AdmissionsClerk',
  );
  userEditsCorrespondence(cerebralTest, 'AdmissionsClerk');
  userDeletesCorrespondence(
    cerebralTest,
    firstCorrespondenceTitle,
    'AdmissionsClerk',
  );

  loginAs(cerebralTest, 'general@example.com');
  userNavigatesToAddCorrespondence(cerebralTest, 'General user');
  userAddsCorrespondence(
    cerebralTest,
    firstCorrespondenceTitle,
    'General user',
  );
  userNavigatesToEditCorrespondence(
    cerebralTest,
    firstCorrespondenceTitle,
    'General user',
  );
  userEditsCorrespondence(cerebralTest, 'General user');
  userDeletesCorrespondence(cerebralTest, firstCorrespondenceTitle);
});
