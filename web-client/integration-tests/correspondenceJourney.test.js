import { docketClerkAddsCorrespondence } from './journey/docketClerkAddsCorrespondence';
import { docketClerkCreatesMessageWithCorrespondence } from './journey/docketClerkCreatesMessageWithCorrespondence';
import { docketClerkDeletesCorrespondence } from './journey/docketClerkDeletesCorrespondence';
import { docketClerkEditsCorrespondence } from './journey/docketClerkEditsCorrespondence';
import { docketClerkNavigatesToAddCorrespondence } from './journey/docketClerkNavigatesToAddCorrespondence';
import { docketClerkNavigatesToEditCorrespondence } from './journey/docketClerkNavigatesToEditCorrespondence';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

describe('Adds correspondence to a case', () => {
  let caseDetail;

  const test = setupTest();

  const firstCorrespondenceTitle = 'My first correspondence';
  const secondCorrespondenceTitle = 'My second correspondence';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('create case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkNavigatesToAddCorrespondence(test);
  docketClerkAddsCorrespondence(test, firstCorrespondenceTitle);
  docketClerkAddsCorrespondence(test, secondCorrespondenceTitle);
  docketClerkNavigatesToEditCorrespondence(test, firstCorrespondenceTitle);
  docketClerkCreatesMessageWithCorrespondence(test);
  docketClerkEditsCorrespondence(test, fakeFile);
  docketClerkDeletesCorrespondence(test);
});
