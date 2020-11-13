import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkAddsNoticeToCase } from './journey/petitionsClerkAddsNoticeToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingNotice } from './journey/petitionsClerkViewsCaseDetailAfterAddingNotice';
import { petitionsClerkViewsDraftDocumentsForNotice } from './journey/petitionsClerkViewsDraftDocumentsForNotice';

const test = setupTest();
describe('Petitions Clerk Create Notice Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsNoticeToCase(test);
  petitionsClerkViewsCaseDetailAfterAddingNotice(test, 4);
  petitionsClerkViewsDraftDocumentsForNotice(test, 1);
  petitionsClerkAddsDocketEntryFromOrder(test);
});
