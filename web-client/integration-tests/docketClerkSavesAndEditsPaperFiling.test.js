import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkEditsPaperFiledDocketEntryFromQC } from './journey/docketClerkEditsPaperFiledDocketEntryFromQC';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('Docket clerk saves and then edits a paper filing', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk1@example.com');
  docketClerkAddsPaperFiledDocketEntryAndSavesForLater(cerebralTest, fakeFile);
  docketClerkEditsPaperFiledDocketEntryFromQC(cerebralTest);
});
