import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionsClerkViewsDocketRecordEditLinks } from './journey/petitionsClerkViewsDocketRecordEditLinks';

const test = setupTest();

describe('Petitions clerk docket record journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('create the case for this test', async () => {
    const caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });
  petitionerFilesDocumentForCase(test, fakeFile);

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsDocketRecordEditLinks(test);
});
