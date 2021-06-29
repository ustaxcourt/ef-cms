import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkEditsPaperFiledDocketEntryFromQC } from './journey/docketClerkEditsPaperFiledDocketEntryFromQC';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('Docket clerk saves and then edits a paper filing', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk1@example.com');
  docketClerkAddsPaperFiledDocketEntryAndSavesForLater(test, fakeFile);
  docketClerkEditsPaperFiledDocketEntryFromQC(test);
});
