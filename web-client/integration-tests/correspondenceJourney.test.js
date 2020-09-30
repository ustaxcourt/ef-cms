import { docketClerkAddsCorrespondence } from './journey/docketClerkAddsCorrespondence';
import { docketClerkDeletesCorrespondence } from './journey/docketClerkDeletesCorrespondence';
import { docketClerkEditsCorrespondence } from './journey/docketClerkEditsCorrespondence';
import { docketClerkNavigatesToAddCorrespondence } from './journey/docketClerkNavigatesToAddCorrespondence';
import { docketClerkNavigatesToEditCorrespondence } from './journey/docketClerkNavigatesToEditCorrespondence';
import { docketClerkStartsNewMessageWithCorrespondence } from './journey/docketClerkStartsNewMessageWithCorrespondence';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();
let caseDetail;
const correspondenceTitle = 'My correspondence';

describe('Adds correspondence to a case', () => {
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
  docketClerkAddsCorrespondence(test, correspondenceTitle);
  docketClerkNavigatesToEditCorrespondence(test, correspondenceTitle);
  docketClerkStartsNewMessageWithCorrespondence(test);
  docketClerkEditsCorrespondence(test, fakeFile);
  docketClerkDeletesCorrespondence(test);
});
