import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkEditsPaperFiledDocketEntry } from './journey/docketClerkEditsPaperFiledDocketEntry';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('Docket clerk saves and then edits a paper filing', () => {
  loginAs(test, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk1@example.com');
  docketClerkAddsPaperFiledDocketEntryAndSavesForLater(test, fakeFile);
  docketClerkEditsPaperFiledDocketEntry(test);
});
