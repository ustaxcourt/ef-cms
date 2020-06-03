import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkAddsNoticeToCase } from './journey/petitionsClerkAddsNoticeToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingNotice } from './journey/petitionsClerkViewsCaseDetailAfterAddingNotice';
import { petitionsClerkViewsDocumentDetail } from './journey/petitionsClerkViewsDocumentDetail';
import { petitionsClerkViewsDraftDocumentsForNotice } from './journey/petitionsClerkViewsDraftDocumentsForNotice';

const test = setupTest();

describe('Petitions Clerk Create Notice Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsNoticeToCase(test);
  petitionsClerkViewsCaseDetailAfterAddingNotice(test);
  petitionsClerkViewsDraftDocumentsForNotice(test, 1);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkAddsDocketEntryFromOrder(test);
});
